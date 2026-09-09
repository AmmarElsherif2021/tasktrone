import { DBAdapter } from '../../../src/db/adapter'
import { UserRepository } from '../../../src/db/repositories/UserRepository'
import { User } from '../../../src/domain/user.entity'
import { makeUser } from '../../factories/entities'

/**
 * Inserts a real user row against the DB behind `db` (via UserRepository,
 * not raw SQL), defaulting its fields from `makeUser()` so integration
 * fixtures stay in sync with the unit-tier entity factory they mirror.
 * Pass overrides to vary specific fields for a given test. Requires the
 * `users` table from tests/integration/schema.ts.
 */
export async function seedUser(
  db: DBAdapter,
  overrides: Partial<Pick<User, 'organizationId' | 'email' | 'displayName' | 'role'>> = {},
): Promise<User> {
  const defaults = makeUser()
  return new UserRepository(db).create({
    organizationId: overrides.organizationId ?? defaults.organizationId,
    email: overrides.email ?? defaults.email,
    displayName: overrides.displayName ?? defaults.displayName,
    role: overrides.role ?? defaults.role,
  })
}
