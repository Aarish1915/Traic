import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';

function loadDotenv() {
  const possiblePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '.env'),
    path.resolve(process.cwd(), '../..', '.env'),
    path.resolve(process.cwd(), 'apps/api/.env'),
  ];
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!(key in process.env)) {
              process.env[key] = val;
            }
          }
        }
      } catch (_) {}
    }
  }
}

loadDotenv();

// Support common aliases from Neon Console (e.g. neondb=...)
if (!process.env.DATABASE_URL && (process.env.neondb || process.env.NEON_DATABASE_URL)) {
  process.env.DATABASE_URL = process.env.neondb || process.env.NEON_DATABASE_URL;
}

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),
  SESSION_SECRET: z.string().min(16).default('development_secret_must_change_in_production'),
  ADMIN_PASSWORD: z.string().min(8).default('traic_admin_2025!'),
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

