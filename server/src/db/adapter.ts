/**
 * Driver-agnostic contract that repositories depend on. Concrete implementations
 * (e.g. PostgresAdapter) live under server/src/db/implementations; tests use
 * MockAdapter (server/tests/mocks/MockAdapter.ts) instead of a real database.
 */
export interface DBAdapter {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>
  queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>
  transaction<T>(fn: (db: DBAdapter) => Promise<T>): Promise<T>
}
