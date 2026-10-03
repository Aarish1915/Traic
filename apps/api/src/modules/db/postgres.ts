import { Pool } from 'pg';
import { env } from '../../config/env';
import { logger } from '../../common/logger';

const VALID_TABLES = [
  'projects',
  'events',
  'achievements',
  'members',
  'alumni',
  'tracks',
  'banners',
  'gallery',
  'settings',
  'applications',
  'messages',
  'gear',
] as const;

export type ValidTable = (typeof VALID_TABLES)[number];

class PostgresDatabase {
  private pool: Pool | null = null;
  public isConnected = false;

  constructor() {
    if (!env.DATABASE_URL) {
      logger.error('Database: CRITICAL: No DATABASE_URL provided. Neon Serverless PostgreSQL connection required.');
      return;
    }

    try {
      // Sanitize connection string: strip channel_binding (unsupported by node-postgres per Neon docs)
      const cleanUrl = env.DATABASE_URL
        .replace(/&channel_binding=[^&]*/g, '')
        .replace(/\?channel_binding=[^&]*&?/g, '?')
        .replace(/\?$/, '');

      const isSsl = cleanUrl.includes('sslmode=') || env.NODE_ENV === 'production';
      this.pool = new Pool({
        connectionString: cleanUrl,
        ssl: isSsl ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 15000,
      });

      this.pool.on('error', (err) => {
        logger.error({ err }, 'PostgreSQL Pool background client error');
      });
    } catch (err) {
      logger.error({ err }, 'Failed to initialize Neon PostgreSQL connection pool.');
      this.pool = null;
    }
  }

  public async init(): Promise<boolean> {
    if (!this.pool) return false;

    try {
      // Test connectivity
      await this.pool.query('SELECT 1');
      this.isConnected = true;
      logger.info('Database: Successfully connected to remote PostgreSQL (Neon).');

      // Create all entity tables if they do not exist
      for (const table of VALID_TABLES) {
        await this.pool.query(`
          CREATE TABLE IF NOT EXISTS ${table} (
            id VARCHAR(120) PRIMARY KEY,
            data JSONB NOT NULL,
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
        await this.pool.query(`
          CREATE INDEX IF NOT EXISTS idx_${table}_updated_at ON ${table} (updated_at DESC);
        `);
      }

      return true;
    } catch (err) {
      logger.error({ err }, 'Neon PostgreSQL connection/initialization failed.');
      this.isConnected = false;
      return false;
    }
  }

  public async loadAll<T>(table: ValidTable): Promise<T[]> {
    if (!this.pool || !this.isConnected) return [];
    try {
      const res = await this.pool.query<{ data: T }>(
        `SELECT data FROM ${table} ORDER BY updated_at DESC;`
      );
      return res.rows.map((r) => r.data);
    } catch (err) {
      logger.error({ err, table }, `Failed to load records from ${table}`);
      return [];
    }
  }

  public async count(table: ValidTable): Promise<number> {
    if (!this.pool || !this.isConnected) return 0;
    try {
      const res = await this.pool.query<{ count: string }>(`SELECT COUNT(*) FROM ${table};`);
      return parseInt(res.rows[0]?.count || '0', 10);
    } catch (err) {
      logger.error({ err, table }, `Failed to count records in ${table}`);
      return 0;
    }
  }

  public async upsert<T>(table: ValidTable, id: string | undefined, data: T): Promise<void> {
    if (!this.pool || !this.isConnected) return;
    const finalId = id || (data as any)?.id || crypto.randomUUID();
    try {
      const query = `
        INSERT INTO ${table} (id, data, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (id) DO UPDATE
        SET data = EXCLUDED.data, updated_at = NOW();
      `;
      await this.pool.query(query, [finalId, JSON.stringify(data)]);
    } catch (err) {
      logger.error({ err, table, id: finalId }, `Failed to upsert record in ${table}`);
    }
  }

  public async delete(table: ValidTable, id: string | undefined): Promise<boolean> {
    if (!this.pool || !this.isConnected || !id) return false;
    try {
      const query = `DELETE FROM ${table} WHERE id = $1;`;
      const res = await this.pool.query(query, [id]);
      return (res.rowCount ?? 0) > 0;
    } catch (err) {
      logger.error({ err, table, id }, `Failed to delete record from ${table}`);
      return false;
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
    }
  }
}

export const db = new PostgresDatabase();
