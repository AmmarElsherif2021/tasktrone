import { PostgresAdapter } from '../../src/db/implementations/PostgresAdapter'
import { Board } from '../../src/domain/board.entity'
import { Task } from '../../src/domain/task.entity'
import { User } from '../../src/domain/user.entity'
import { seedBoard, seedTask, seedUser } from './factories'
import { createSchema, dropSchema } from './schema'

/**
 * Requires a running Postgres — `docker compose up -d` in server/ first.
 * Excluded from `npm test`; run explicitly with `npm run test:integration`.
 */
const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://tasktrone:tasktrone@localhost:5432/tasktrone'

describe('PostgresAdapter (integration)', () => {
  let adapter: PostgresAdapter

  beforeAll(async () => {
    adapter = new PostgresAdapter(DATABASE_URL)
    await createSchema(adapter)
    await adapter.query(`
      CREATE TABLE IF NOT EXISTS adapter_smoke_test (
        id SERIAL PRIMARY KEY,
        label TEXT NOT NULL
      )
    `)
  })

  afterEach(async () => {
    await adapter.query('DELETE FROM adapter_smoke_test')
  })

  afterAll(async () => {
    await adapter.query('DROP TABLE IF EXISTS adapter_smoke_test')
    await dropSchema(adapter)
    await adapter.close()
  })

  it('reads back seeded board/task/user rows with camelCase-mapped columns', async () => {
    const board = await seedBoard(adapter, { name: 'Seeded Board' })
    const task = await seedTask(adapter, board.id, { title: 'Seeded Task' })
    const user = await seedUser(adapter, { organizationId: board.organizationId })

    const [foundTask] = await adapter.query<Task>('SELECT * FROM tasks WHERE id = $1', [task.id])
    expect(foundTask.boardId).toBe(board.id)
    expect(foundTask.title).toBe('Seeded Task')

    const foundBoard = await adapter.queryOne<Board>('SELECT * FROM boards WHERE id = $1', [board.id])
    expect(foundBoard?.name).toBe('Seeded Board')

    const foundUser = await adapter.queryOne<User>('SELECT * FROM users WHERE id = $1', [user.id])
    expect(foundUser?.displayName).toBe(user.displayName)
    expect(foundUser?.organizationId).toBe(board.organizationId)
  })

  it('performs basic CRUD against a real Postgres instance', async () => {
    const inserted = await adapter.queryOne<{ id: number; label: string }>(
      'INSERT INTO adapter_smoke_test (label) VALUES ($1) RETURNING *',
      ['hello'],
    )
    expect(inserted?.label).toBe('hello')

    const found = await adapter.queryOne<{ id: number; label: string }>(
      'SELECT * FROM adapter_smoke_test WHERE id = $1',
      [inserted!.id],
    )
    expect(found).toEqual(inserted)

    await adapter.query('UPDATE adapter_smoke_test SET label = $1 WHERE id = $2', ['updated', inserted!.id])
    const updated = await adapter.queryOne<{ label: string }>(
      'SELECT label FROM adapter_smoke_test WHERE id = $1',
      [inserted!.id],
    )
    expect(updated?.label).toBe('updated')

    const rows = await adapter.query('SELECT * FROM adapter_smoke_test')
    expect(rows).toHaveLength(1)
  })

  it('rolls back the transaction when the callback throws', async () => {
    await expect(
      adapter.transaction(async (tx) => {
        await tx.query('INSERT INTO adapter_smoke_test (label) VALUES ($1)', ['should-rollback'])
        throw new Error('force rollback')
      }),
    ).rejects.toThrow('force rollback')

    const rows = await adapter.query('SELECT * FROM adapter_smoke_test')
    expect(rows).toHaveLength(0)
  })

  it('commits the transaction when the callback succeeds', async () => {
    await adapter.transaction(async (tx) => {
      await tx.query('INSERT INTO adapter_smoke_test (label) VALUES ($1)', ['committed'])
    })

    const rows = await adapter.query<{ label: string }>('SELECT * FROM adapter_smoke_test')
    expect(rows).toEqual([expect.objectContaining({ label: 'committed' })])
  })
})
