import { router } from './trpc';
import { userRouter } from './routers/user';

export const appRouter = router({
  user: userRouter,
  // you can add other routers here
});

export type AppRouter = typeof appRouter; 