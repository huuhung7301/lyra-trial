import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const viewRouter = createTRPCRouter({
  /**
   * Get all views for a specific table
   */
  getAllViewsByTableId: publicProcedure
    .input(z.object({ tableId: z.number() })) // Expecting the table ID as a number
    .query(async ({ ctx, input }) => {
      return await ctx.db.view.findMany({
        where: {
          tableid: input.tableId, // No need for conversion, as input is already a number
        },
      });
    }),

  /**
   * Get a specific view by ID
   */
  getViewById: publicProcedure
  .input(z.object({ 
    viewId: z.number(),  // Expecting the view ID as a number
    tableId: z.number(), // Expecting the table ID as a number
  })) 
  .query(async ({ ctx, input }) => {
    // Fetch the view and its related table (with tabledata)
    const viewData = await ctx.db.view.findUnique({
      where: {
        id: input.viewId,
      },
      include: {
        table: true, // Include table data (with tabledata JSON)
      },
    });

    // Ensure view exists
    if (!viewData) {
      throw new Error("View not found");
    }

    // Return the view data along with the full table data (including tabledata)
    return {
      ...viewData,
      tableData: viewData.table.tabledata,  // Include table data
    };
  }),

  /**
   * Create a new view for a specific table
   */
  createView: publicProcedure
    .input(
      z.object({
        name: z.string().min(1), // Name of the view
        filters: z.unknown().optional(), // Filters as JSON object
        sorting: z.unknown().optional(), // Sorting configuration as JSON object
        hiddenFields: z.unknown().optional(), // Hidden fields as JSON object
        tableid: z.number(), // Table ID as a number
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newView = await ctx.db.view.create({
        data: {
          name: input.name,
          filters: input.filters ?? [],
          sorting: input.sorting ?? [],
          hiddenFields: input.hiddenFields ?? [],
          tableid: input.tableid, // Directly use the tableid as a number
        },
      });
      return newView;
    }),

  /**
   * Update an existing view
   */
  updateView: publicProcedure
    .input(
      z.object({
        id: z.number(), // ID of the view to update
        name: z.string().min(1).optional(), // Optional view name
        filters: z.unknown().optional(), // Optional filters as valid JSON
        sorting: z.unknown().optional(), // Optional sorting as valid JSON
        hiddenFields: z.unknown().optional(), // Optional hidden fields as valid JSON
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedView = await ctx.db.view.update({
        where: {
          id: input.id, // Find the view by ID
        },
        data: {
          name: input.name ?? undefined, // Only include if name is provided
          filters: input.filters ?? [], // If not provided, default to empty array
          sorting: input.sorting ?? [], // If not provided, default to empty array
          hiddenFields: input.hiddenFields ?? [], // If not provided, default to empty array
        },
      });

      return updatedView;
    }),

  /**
   * Delete a view by ID
   */
  deleteView: publicProcedure
    .input(z.object({ id: z.number() })) // Expecting the view ID as a number
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.view.delete({
        where: {
          id: input.id, // Directly use the id as a number
        },
      });
    }),
});
