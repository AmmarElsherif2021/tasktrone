import { PostgresAdapter } from './db/implementations/PostgresAdapter'
import { BoardRepository } from './db/repositories/BoardRepository'
import { TaskRepository } from './db/repositories/TaskRepository'
import { BoardService } from './services/BoardService'
import { TaskService } from './services/TaskService'

export interface AppServices {
  taskService: TaskService
  boardService: BoardService
  adapter: PostgresAdapter
}

/** Wires adapter -> repositories -> services. Controllers (Epic 2) consume the returned services. */
export function bootstrap(databaseUrl: string = process.env.DATABASE_URL ?? ''): AppServices {
  const adapter = new PostgresAdapter(databaseUrl)

  const taskRepo = new TaskRepository(adapter)
  const boardRepo = new BoardRepository(adapter)

  const boardService = new BoardService(boardRepo)
  const taskService = new TaskService(taskRepo, boardRepo)

  return { taskService, boardService, adapter }
}
