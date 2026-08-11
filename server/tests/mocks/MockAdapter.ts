import { DBAdapter } from '../../src/db/adapter'

interface RecordedCall {
  method: 'query' | 'queryOne'
  sql: string
  params?: unknown[]
}

/**
 * In-memory DBAdapter used by unit tests. Queue results with mockNextResult()
 * before calling the code under test, then assert on `calls` to check the
 * SQL/params a repository sent.
 */
export class MockAdapter implements DBAdapter {
  public readonly calls: RecordedCall[] = []
  private readonly queuedResults: unknown[][] = []

  mockNextResult(rows: unknown[]): void {
    this.queuedResults.push(rows)
  }

  async query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
    this.calls.push({ method: 'query', sql, params })
    return (this.queuedResults.shift() ?? []) as T[]
  }

  async queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
    this.calls.push({ method: 'queryOne', sql, params })
    const rows = (this.queuedResults.shift() ?? []) as T[]
    return rows[0] ?? null
  }

  async transaction<T>(fn: (db: DBAdapter) => Promise<T>): Promise<T> {
    return fn(this)
  }
}
