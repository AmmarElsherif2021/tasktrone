import { randomUUID } from 'crypto'
import { Task } from '../../../src/domain/task.entity'

/**
 * Builds a valid, fully-populated Task domain entity for unit tests. Call with
 * overrides to vary only the field(s) under test rather than restating the
 * whole object:
 *
 *   makeTask({ status: 'in_progress' })
 *   makeTask({ position3d: undefined })
 */
export function makeTask(overrides: Partial<Task> = {}): Task {
  const now = new Date()
  return {
    id: randomUUID(),
    boardId: randomUUID(),
    title: 'Weld frame',
    description: 'Weld the main chassis frame joints',
    status: 'todo',
    position3d: { x: 0, y: 0, z: 0 },
    modelRef: undefined,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
