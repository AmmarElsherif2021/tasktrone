import { DBAdapter } from '../../../src/db/adapter'
import { TaskRepository } from '../../../src/db/repositories/TaskRepository'
import { Task } from '../../../src/domain/task.entity'
import { makeTask } from '../../factories/entities'

/**
 * Inserts a real task row against the DB behind `db` (via TaskRepository,
 * not raw SQL) under the given board, defaulting its fields from `makeTask()`
 * so integration fixtures stay in sync with the unit-tier entity factory
 * they mirror. Pass overrides to vary specific fields for a given test.
 */
export async function seedTask(
  db: DBAdapter,
  boardId: string,
  overrides: Partial<Pick<Task, 'title' | 'description' | 'position3d' | 'modelRef'>> = {},
): Promise<Task> {
  const defaults = makeTask()
  return new TaskRepository(db).create({
    boardId,
    title: overrides.title ?? defaults.title,
    description: overrides.description ?? defaults.description,
    position3d: overrides.position3d ?? defaults.position3d,
    modelRef: overrides.modelRef ?? defaults.modelRef,
  })
}
