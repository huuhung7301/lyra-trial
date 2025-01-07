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
    .input(z.object({ baseId: z.number() }))
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
    .input(z.object({ id: z.number() }))
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
      baseid: z.number(),
      tabledata: z.array( // Change this to an array of objects
        z.object({
          id: z.number(),
          name: z.string(),
          notes: z.string(),
          assignee: z.string(),
          status: z.string(),
        })
      ),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const newTable = await ctx.db.table.create({
      data: {
        name: input.name,
        baseid: input.baseid,
        tabledata: input.tabledata, // This will now accept the array
      },
    });
    return newTable;
  }),


  /**
   * Update a table by ID
   */
  updateTable: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        tabledata: z.object({}).optional(), // Optional update fields
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return await ctx.db.table.update({
        where: { id },
        data: updateData,
      });
    }),

  /**
   * Delete a table by ID
   */
  deleteTable: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.table.delete({
        where: {
          id: input.id, // Find and delete the table by ID
        },
      });
    }),
});
