import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),

    DISCORD_CLIENT_ID: z.string().min(1),
    DISCORD_CLIENT_SECRET: z.string().min(1),
    DISCORD_CLIENT_TOKEN: z.string().min(1),

    NEXTAUTH_URL: z.string().url().optional(),
    NEXTAUTH_SECRET: z.string().min(1),

    UPLOADTHING_TOKEN: z.string().min(1),
  },

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,

    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_CLIENT_TOKEN: process.env.DISCORD_CLIENT_TOKEN,

    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
  },
});
