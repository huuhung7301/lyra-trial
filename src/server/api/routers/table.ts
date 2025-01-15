import { table } from "console";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type SortingItem = {
  field: string;
  direction: "asc" | "desc";
};

export const tableRouter = createTRPCRouter({
  /**
   * Get all tables for a specific base
   */
  getAllTablesByBaseId: publicProcedure
    .input(z.object({ baseId: z.number() })) // Change baseId to number
    .query(async ({ ctx, input }) => {
      return await ctx.db.table.findMany({
        where: {
          baseid: input.baseId, // Filter by base ID
        },
      });
    }),

  /**
   * Get a specific table by ID
   */
  getTableById: publicProcedure
    .input(z.object({ id: z.number() })) // Change id to number
    .query(async ({ ctx, input }) => {
      return await ctx.db.table.findUnique({
        where: {
          id: input.id, // Find the table by ID
        },
      });
    }),

  getPaginationTableById: publicProcedure
    .input(
      z.object({
        id: z.number(), // ID of the view
        viewId: z.number(),
        limit: z.number().default(10), // Pagination limit
        offset: z.number().default(0), // Pagination offset
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id, viewId, limit, offset } = input;

      // Retrieve view configuration from the database
      const view = await ctx.db.view.findUnique({
        where: { id: viewId },
        include: { table: true }, // Include related table if needed
      });

      if (!view) {
        throw new Error(`View with ID ${id} not found`);
      }

      // Default to empty arrays if undefined
      const filters =
        (view.filters as Array<{
          field: string;
          operator: string;
          value?: string;
        }>) ?? [];

      // Ensure sorting is always an array

      const hiddenFields = (view.hiddenFields as string[]) ?? [];

      // Build filter conditions as raw SQL
      const filterConditions = filters.length
        ? filters
            .map(({ field, operator, value }) => {
              switch (operator) {
                case "contains":
                  return `elem->>'${field}' ILIKE '%${value}%'`;
                case "does not contain":
                  return `NOT (elem->>'${field}' ILIKE '%${value}%')`;
                case "is":
                  return `elem->>'${field}' = '${value}'`;
                case "is not":
                  return `elem->>'${field}' != '${value}'`;
                case "starts with":
                  return `elem->>'${field}' ILIKE '${value}%'`;
                case "ends with":
                  return `elem->>'${field}' ILIKE '%${value}'`;
                case "is empty":
                  return `(elem->>'${field}' IS NULL OR elem->>'${field}' = '')`;
                case "is not empty":
                  return `(elem->>'${field}' IS NOT NULL AND elem->>'${field}' != '')`;
                default:
                  return "1=1"; // Always true condition for unsupported operators
              }
            })
            .join(" AND ")
        : "1=1";

      // Construct sorting clause (only if sorting exists)
      const sorting = Array.isArray(view.sorting) ? view.sorting : []; // Default to empty array if sorting is not a valid array

      const sortingClause = sorting.length
        ? sorting
            .filter((item): item is SortingItem => item !== null) // Filter out null values
            .map((item) => {
              // Ensure item is an object with `field` and `direction` properties
              const { field, direction } = item;
              if (
                typeof field === "string" &&
                (direction === "asc" || direction === "desc")
              ) {
                return `elem->>'${field}' ${direction}`;
              } else {
                throw new Error(
                  `Invalid field or direction: ${field}, ${direction}`,
                );
              }
            })
            .join(", ")
        : "";

      const hiddenFieldsClause =
        hiddenFields.length > 0
          ? hiddenFields
              .map((field) => `'${field}', elem->>'${field}'`)
              .concat(`'id', elem->>'id'`) // Add 'id' field explicitly
              .join(", ")
          : `'id', elem->>'id'`; // If no hidden fields, include only 'id'

      // Construct raw SQL query
      const rawQuery = `
        SELECT 
          jsonb_agg(
            jsonb_strip_nulls(
              jsonb_build_object(
                ${hiddenFieldsClause}
              )
            )
          ) AS tabledata
        FROM (
          SELECT 
            elem
          FROM "Table", jsonb_array_elements("tabledata") AS elem
          WHERE "Table".id = ${view.tableid}
            AND (${filterConditions})
          ${sortingClause ? `ORDER BY ${sortingClause}` : ""}
          LIMIT ${limit} OFFSET ${offset}
        ) AS items;
      `;

      // Execute the query
      const result = await ctx.db.$queryRawUnsafe(rawQuery);
      return result;
    }),

  getPaginationTableById2: publicProcedure
    .input(
      z.object({
        id: z.number(), // ID of the table
        filters: z
          .array(
            z.object({
              field: z.string(),
              operator: z.string(),
              value: z.any().optional(),
            }),
          )
          .default([]), // Array of filter conditions
        sorting: z
          .array(
            z.object({
              field: z.string(),
              direction: z.enum(["asc", "desc"]),
            }),
          )
          .default([]), // Array of sorting conditions
        hiddenFields: z.array(z.string()).default([]), // List of hidden fields
        limit: z.number().default(10), // Pagination limit
        offset: z.number().default(0), // Pagination offset
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id, filters, sorting, hiddenFields, limit, offset } = input;

      // Build filter conditions as raw SQL
      const filterConditions = filters.length
        ? filters
            .map(({ field, operator, value }) => {
              switch (operator) {
                case "contains":
                  return `elem->>'${field}' ILIKE '%${value}%'`;
                case "does not contain":
                  return `NOT (elem->>'${field}' ILIKE '%${value}%')`;
                case "is":
                  return `elem->>'${field}' = '${value}'`;
                case "is not":
                  return `elem->>'${field}' != '${value}'`;
                case "starts with":
                  return `elem->>'${field}' ILIKE '${value}%'`;
                case "ends with":
                  return `elem->>'${field}' ILIKE '%${value}'`;
                case "is empty":
                  return `(elem->>'${field}' IS NULL OR elem->>'${field}' = '')`;
                case "is not empty":
                  return `(elem->>'${field}' IS NOT NULL AND elem->>'${field}' != '')`;
                default:
                  return "1=1"; // Always true condition for unsupported operators
              }
            })
            .join(" AND ")
        : "1=1";

      const sortingClause = sorting.length
        ? sorting
            .filter((item): item is SortingItem => item !== null) // Filter out null values
            .map((item) => {
              // Ensure item is an object with `field` and `direction` properties
              const { field, direction } = item;
              if (
                typeof field === "string" &&
                (direction === "asc" || direction === "desc")
              ) {
                return `elem->>'${field}' ${direction}`;
              } else {
                throw new Error(
                  `Invalid field or direction: ${field}, ${direction}`,
                );
              }
            })
            .join(", ")
        : "";

      // Construct hidden fields clause
      const hiddenFieldsClause =
        hiddenFields.length > 0
          ? hiddenFields
              .map((field) => `'${field}', elem->>'${field}'`)
              .concat(`'id', elem->>'id'`) // Add 'id' field explicitly
              .join(", ")
          : `'id', elem->>'id'`; // If no hidden fields, include only 'id'

      // Construct raw SQL query
      const rawQuery = `
        SELECT 
          jsonb_agg(
            jsonb_strip_nulls(
              jsonb_build_object(
                ${hiddenFieldsClause}
              )
            )
          ) AS tabledata
        FROM (
          SELECT 
            elem
          FROM "Table", jsonb_array_elements("tabledata") AS elem
          WHERE "Table".id = ${id}
            AND (${filterConditions})
          ${sortingClause ? `ORDER BY ${sortingClause}` : ""}
          LIMIT ${limit} OFFSET ${offset}
        ) AS items;
      `;

      // Execute the query
      const result = await ctx.db.$queryRawUnsafe(rawQuery);
      return result;
    }),

  /**
   * Create a new table for a specific base
   */
  createTable: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        baseid: z.number(), // Change baseid to number
        tabledata: z.unknown().optional(), // tabledata is optional and can accept any valid JSON
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newTable = await ctx.db.table.create({
        data: {
          name: input.name,
          baseid: input.baseid,
          tabledata: input.tabledata ?? [], // If tabledata is not provided, use an empty array as fallback
        },
      });
      return newTable;
    }),

  /**
   * Update a table by ID
   */
  updateTable: publicProcedure
    .input(
      z.object({
        id: z.number(), // Change id to number
        tabledata: z.unknown().optional(), // Expecting an array of objects for tabledata
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tabledata } = input;

      if (!tabledata) {
        throw new Error("No tabledata provided"); // Ensure tabledata is available
      }

      // Update the table with the new data
      return await ctx.db.table.update({
        where: { id },
        data: {
          tabledata, // Save the array (or object) directly to the JSON column
        },
      });
    }),

  updateTable2: publicProcedure
    .input(
      z.object({
        tableId: z.number(), // The id of the table to update
        newRowData: z.array(z.unknown()), // List of new row data to update
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { tableId, newRowData } = input;

      if (!newRowData || newRowData.length === 0) {
        throw new Error("newRowData must be provided and not empty");
      }

      // Loop over each row in newRowData and update the matching row by id
      for (const updatedRow of newRowData) {
        // Assert the type of updatedRow to be a Record with an 'id' property
        const row = updatedRow as Record<string, unknown>;

        // Ensure the row has an 'id' field
        const rowId = row.id as string;
        if (rowId === undefined) {
          throw new Error("Row does not have an 'id' field");
        }

        // Prepare the new row data as a JSON object
        const newRowJson = JSON.stringify(row);

        // Query to find the index of the row based on 'id' and update the table
        const query = `
            WITH idx_cte AS (
              SELECT idx
              FROM "Table",jsonb_array_elements("Table".tabledata) WITH ORDINALITY arr(row, idx)
              WHERE "Table".id = '${tableId}'
              AND row->>'id' = '${rowId}'
              LIMIT 1
            )
            UPDATE "Table"
            SET tabledata = jsonb_set(
              tabledata,
              ('{' || (idx_cte.idx - 1) || '}')::text[],
              '${newRowJson}'::jsonb
            )
            FROM idx_cte
            WHERE id = '${tableId}';
          `;

        await ctx.db.$queryRawUnsafe(query);
      }

      return { success: true };
    }),

  /**
   * Delete a table by ID
   */
  deleteTable: protectedProcedure
    .input(z.object({ id: z.number() })) // Change id to number
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.table.delete({
        where: {
          id: input.id, // Find and delete the table by ID
        },
      });
    }),
});
