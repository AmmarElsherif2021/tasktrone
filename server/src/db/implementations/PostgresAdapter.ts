import { Pool, PoolClient, PoolConfig } from 'pg'
import { DBAdapter } from '../adapter'
import { toCamelCaseRow } from './case-mapping'

/** Wraps a single checked-out client so queries inside a transaction share one connection. */
class ClientAdapter implements DBAdapter {
  constructor(private readonly client: PoolClient) {}

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.client.query(sql, params)
    return result.rows.map((row) => toCamelCaseRow<T>(row))
  }

  async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params)
    return rows[0] ?? null
  }

  async transaction<T>(fn: (db: DBAdapter) => Promise<T>): Promise<T> {
    // Already inside a transaction on this client; no savepoints for now.
    return fn(this)
  }
}

export class PostgresAdapter implements DBAdapter {
  private readonly pool: Pool

  constructor(config: string | PoolConfig = process.env.DATABASE_URL ?? '') {
    this.pool = typeof config === 'string' ? new Pool({ connectionString: config }) : new Pool(config)
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.pool.query(sql, params)
    return result.rows.map((row) => toCamelCaseRow<T>(row))
  }

  async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params)
    return rows[0] ?? null
  }

  async transaction<T>(fn: (db: DBAdapter) => Promise<T>): Promise<T> {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      const result = await fn(new ClientAdapter(client))
      await client.query('COMMIT')
      return result
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }
  }

  async close(): Promise<void> {
    await this.pool.end()
  }
}
