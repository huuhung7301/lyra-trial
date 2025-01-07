import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
  /**
   * Get all bases with their related tables
   */
  getAllBases: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.base.findMany({});
  }),

  /**
   * Get a specific base by ID
   */
  getBaseById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.base.findUnique({
        where: {
          id: input.id,
        },
        include: {
          tables: true, // Include related tables
        },
      });
    }),

  /**
   * Create a new base
   */
  // In your trpc API file
  createBase: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        type: z.string(),
        workspace: z.string(),
        owner: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newBase = await ctx.db.base.create({
        data: {
          title: input.title,
          type: input.type,
          workspace: input.workspace,
          owner: input.owner,
        },
      });
      return newBase.id; // Return the id of the newly created base
    }),

  /**
   * Update an existing base
   */
  updateBase: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        type: z.string().optional(),
        workspace: z.string().optional(),
        owner: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return await ctx.db.base.update({
        where: { id },
        data: updateData,
      });
    }),

  /**
   * Delete a base
   */
  deleteBase: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.base.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
