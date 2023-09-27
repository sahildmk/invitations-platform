import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

const nodeEnv = z.enum(["development", "test", "production"]);

const getBaseUrl = () => {
  if (!process.env.VERCEL_ENV) return process.env.BASE_URL;

  if (process.env.VERCEL_ENV === "production") {
    return process.env.VERCEL_URL;
  } else {
    return process.env.VERCEL_BRANCH_URL;
  }
};

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: nodeEnv,
    BASE_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_NODE_ENV: nodeEnv,
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.BASE_URL,
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BASE_URL: getBaseUrl(),
  },
});
