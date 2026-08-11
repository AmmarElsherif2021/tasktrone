import { PostgresAdapter } from './db/implementations/PostgresAdapter'
import { bootstrap } from './bootstrap'
import { BoardService } from './services/BoardService'
import { TaskService } from './services/TaskService'

describe('bootstrap', () => {
  it('wires adapter, repositories and services without connecting to a database', async () => {
    // pg.Pool doesn't open a connection until the first query, so this stays a fast unit test.
    const { taskService, boardService, adapter } = bootstrap('postgres://unused:unused@localhost:5432/unused')

    expect(taskService).toBeInstanceOf(TaskService)
    expect(boardService).toBeInstanceOf(BoardService)
    expect(adapter).toBeInstanceOf(PostgresAdapter)

    await adapter.close()
  })
})
