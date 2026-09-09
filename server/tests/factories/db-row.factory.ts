import { randomUUID } from 'crypto'

/**
 * Builds raw Postgres row shapes — snake_case columns, as `pg` returns them
 * before `toCamelCaseRow` (server/src/db/implementations/case-mapping.ts)
 * converts them to the camelCase domain entities. Use these wherever a test
 * needs to stand in for what the driver hands back pre-mapping (e.g.
 * PostgresAdapter unit specs mocking `pg.Pool#query`); use the entity
 * factories under tests/factories/entities for anything already mapped.
 *
 *   makeTaskRow({ status: 'done' })
 */
export function makeTaskRow(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  const now = new Date()
  return {
    id: randomUUID(),
    board_id: randomUUID(),
    title: 'Weld frame',
    description: 'Weld the main chassis frame joints',
    status: 'todo',
    // JSONB column — its own {x,y,z} keys aren't snake_case and stay untouched
    // by toCamelCaseRow, which only rewrites top-level column names.
    position3d: { x: 0, y: 0, z: 0 },
    model_ref: null,
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function makeBoardRow(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  const now = new Date()
  return {
    id: randomUUID(),
    organization_id: randomUUID(),
    name: 'Prototype Line A',
    created_at: now,
    updated_at: now,
    ...overrides,
  }
}

export function makeUserRow(overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> {
  return {
    id: randomUUID(),
    organization_id: randomUUID(),
    email: 'jane.doe@example.com',
    display_name: 'Jane Doe',
    role: 'member',
    created_at: new Date(),
    ...overrides,
  }
}
