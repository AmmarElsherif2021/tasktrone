import { DBAdapter } from '../../src/db/adapter'

/** Minimal boards/tasks schema shared by the integration specs. Not a migration system —
 * just enough to exercise the adapter/repository/service/HTTP stack against real Postgres. */
export async function createSchema(db: DBAdapter): Promise<void> {
  await db.query(`
    CREATE TABLE IF NOT EXISTS boards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      organization_id UUID NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await db.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      board_id UUID NOT NULL REFERENCES boards(id),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'todo',
      position3d JSONB,
      model_ref TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function dropSchema(db: DBAdapter): Promise<void> {
  await db.query('DROP TABLE IF EXISTS tasks')
  await db.query('DROP TABLE IF EXISTS boards')
}
