import { makeBoardRow, makeTaskRow } from '../../../tests/factories/db-row.factory'

const mockPoolQuery = jest.fn()

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: mockPoolQuery,
  })),
}))

// Imported after the jest.mock above so PostgresAdapter picks up the mocked `pg`.
import { PostgresAdapter } from './PostgresAdapter'

describe('PostgresAdapter', () => {
  beforeEach(() => {
    mockPoolQuery.mockReset()
  })

  it('query() maps a snake_case row to its camelCase shape', async () => {
    const row = makeTaskRow({ board_id: 'b1', model_ref: 'ref-1', created_at: '2026-01-01T00:00:00.000Z' })
    mockPoolQuery.mockResolvedValueOnce({ rows: [row] })
    const adapter = new PostgresAdapter('postgres://unused')

    const [result] = await adapter.query<Record<string, unknown>>('SELECT * FROM tasks')

    expect(result.boardId).toBe(row.board_id)
    expect(result.modelRef).toBe(row.model_ref)
    expect(result.createdAt).toBe(row.created_at)
  })

  it('query() passes sql/params through to the underlying pool query unchanged', async () => {
    mockPoolQuery.mockResolvedValueOnce({ rows: [] })
    const adapter = new PostgresAdapter('postgres://unused')

    await adapter.query('SELECT * FROM tasks WHERE id = $1', ['1'])

    expect(mockPoolQuery).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = $1', ['1'])
  })

  it('queryOne() returns the first mapped row when the pool resolves with rows', async () => {
    const first = makeBoardRow({ organization_id: 'org1' })
    const second = makeBoardRow({ organization_id: 'org2' })
    mockPoolQuery.mockResolvedValueOnce({ rows: [first, second] })
    const adapter = new PostgresAdapter('postgres://unused')

    const result = await adapter.queryOne<Record<string, unknown>>('SELECT * FROM boards')

    expect(result?.organizationId).toBe(first.organization_id)
  })

  it('queryOne() returns null when the pool resolves with zero rows', async () => {
    mockPoolQuery.mockResolvedValueOnce({ rows: [] })
    const adapter = new PostgresAdapter('postgres://unused')

    const result = await adapter.queryOne('SELECT * FROM boards WHERE id = $1', ['missing'])

    expect(result).toBeNull()
  })
})
