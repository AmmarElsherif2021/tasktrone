import { randomUUID } from 'crypto'
import { Board } from '../../../src/domain/board.entity'

/**
 * Builds a valid, fully-populated Board domain entity for unit tests. Call
 * with overrides to vary only the field(s) under test:
 *
 *   makeBoard({ name: 'Prototype Line A' })
 */
export function makeBoard(overrides: Partial<Board> = {}): Board {
  const now = new Date()
  return {
    id: randomUUID(),
    organizationId: randomUUID(),
    name: 'Prototype Line A',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}
