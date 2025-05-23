import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@cineverse/db';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/server/context
 */
export const createContext = async (opts: CreateNextContextOptions) => {
  // for API-response caching see https://trpc.io/docs/v11/server/caching

  return {
    prisma,
    req: opts.req,
    res: opts.res,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>; 