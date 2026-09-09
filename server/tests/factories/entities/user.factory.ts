import { randomUUID } from 'crypto'
import { User } from '../../../src/domain/user.entity'

/**
 * Builds a valid, fully-populated User domain entity for unit tests. Call
 * with overrides to vary only the field(s) under test:
 *
 *   makeUser({ role: 'admin' })
 */
export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: randomUUID(),
    organizationId: randomUUID(),
    email: 'jane.doe@example.com',
    displayName: 'Jane Doe',
    role: 'member',
    createdAt: new Date(),
    ...overrides,
  }
}
