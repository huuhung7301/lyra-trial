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
    // Fetch all bases with their related tables and the first view of the first table
    const bases = await ctx.db.base.findMany({
      include: {
        tables: {
          select: {
            id: true,
            views: {
              select: {
                id: true,  // Select the first view id
              },
              take: 1, // Ensure we only get the first view
            },
          },
        },
      },
    });
  
    // Map over the bases and include the first view id for each base
    return bases.map(base => {
      const firstTable = base.tables[0]; // Assuming the first table is the one you want
      const firstViewId = firstTable?.views[0]?.id; // Get the first view id if available
  
      return {
        ...base,
        firstViewId,  // Add the first view id to the base
      };
    });
  }),
  
  /**
   * Get a specific base by ID
   */
  getBaseById: publicProcedure
  .input(z.object({ id: z.number() }))
  .query(async ({ ctx, input }) => {
    const baseData = await ctx.db.base.findUnique({
      where: {
        id: input.id,
      },
      include: {
        tables: {
          include: {
            views: {
              select: {
                id: true, // Select the first view's ID
              },
              take: 1, // Get only the first view
            },
          },
        },
      },
    });

    if (!baseData) return null;

    // Format response to include firstViewId directly in each table
    return {
      ...baseData,
      tables: baseData.tables.map((table) => ({
        ...table,
        firstViewId: table.views[0]?.id ?? null, // Include firstViewId if available
      })),
    };
  }),

  /**
   * Create a new base
   */
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
      return newBase.id;
    }),

  /**
   * Update an existing base
   */
  updateBase: protectedProcedure
    .input(
      z.object({
        id: z.number(),  // Change id to number
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
    .input(z.object({ id: z.number() }))  // Change id to number
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.base.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
