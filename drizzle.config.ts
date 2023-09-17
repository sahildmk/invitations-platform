import { loadEnvConfig } from "@next/env";
import type { Config } from "drizzle-kit";
import { cwd } from "process";

loadEnvConfig(cwd());

export default {
  schema: "./server/db/schema",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config;
