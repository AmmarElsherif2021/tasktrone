import { MockAdapter } from '../../tests/mocks/MockAdapter'
import { DBAdapter } from './adapter'

/**
 * Minimal stand-in repository used only to demonstrate the adapter-injection
 * pattern. Real repositories (TaskRepository, BoardRepository, UserRepository)
 * are implemented separately under server/src/db/repositories.
 */
class PingRepository {
  constructor(private readonly db: DBAdapter) {}

  async ping(): Promise<{ ok: boolean } | null> {
    return this.db.queryOne<{ ok: boolean }>('SELECT 1 as ok')
  }
}

describe('DBAdapter + MockAdapter', () => {
  it('lets a repository be exercised without a real database', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([{ ok: true }])
    const repo = new PingRepository(adapter)

    const result = await repo.ping()

    expect(result).toEqual({ ok: true })
    expect(adapter.calls).toHaveLength(1)
    expect(adapter.calls[0]).toMatchObject({ method: 'queryOne', sql: expect.stringContaining('SELECT 1') })
  })

  it('records nothing until the adapter is called', () => {
    const adapter = new MockAdapter()
    expect(adapter.calls).toHaveLength(0)
  })
})
