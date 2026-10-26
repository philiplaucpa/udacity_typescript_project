import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { UserCreateSchema, UserAuthenticateSchema } from '../../utils/validation';
import type { Context } from './context';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  createUser: publicProcedure
    .input(UserCreateSchema)
    .mutation(async ({ ctx, input }) => {
      const { passwordHash: _, ...user } = await ctx.userService.createUser(input);
      return user;
    }),

  authenticate: publicProcedure
    .input(UserAuthenticateSchema)
    .mutation(async ({ ctx, input }) => {
      const { passwordHash: _, ...user } = await ctx.userService.authenticate(
        input.email,
        input.password,
      );
      return user;
    }),

  getUserById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const found = await ctx.userService.getUserById(input.id);
      if (!found) return null;
      const { passwordHash: _, ...user } = found;
      return user;
    }),

  listUsers: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.userService.listUsers();
    return users.map(({ passwordHash: _, ...user }) => user);
  }),
});

export type AppRouter = typeof appRouter;
