import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  /**
   * Get all tables for a specific base
   */
  getAllTablesByBaseId: publicProcedure
    .input(z.object({ baseId: z.number() }))  // Change baseId to number
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
    .input(z.object({ id: z.number() }))  // Change id to number
    .query(async ({ ctx, input }) => {
      return await ctx.db.table.findUnique({
        where: {
          id: input.id, // Find the table by ID
        },
      });
    }),

  /**
   * Create a new table for a specific base
   */
  createTable: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        baseid: z.number(),  // Change baseid to number
        tabledata: z.unknown().optional(), // tabledata is optional and can accept any valid JSON
      })
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
        id: z.number(),  // Change id to number
        tabledata: z.unknown().optional(), // Expecting an array of objects for tabledata
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tabledata } = input;

      if (!tabledata) {
        throw new Error('No tabledata provided'); // Ensure tabledata is available
      }

      // Update the table with the new data
      return await ctx.db.table.update({
        where: { id },
        data: {
          tabledata,  // Save the array (or object) directly to the JSON column
        },
      });
    }),

  /**
   * Delete a table by ID
   */
  deleteTable: protectedProcedure
    .input(z.object({ id: z.number() }))  // Change id to number
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.table.delete({
        where: {
          id: input.id, // Find and delete the table by ID
        },
      });
    }),
});
