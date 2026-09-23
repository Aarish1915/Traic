import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),
  SESSION_SECRET: z.string().min(16).default('development_secret_must_change_in_production'),
  DATABASE_URL: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(): Env {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.format());
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();
