# Data layer

Hexagonal adapter/repository split — see [../../../plan.md](../../../plan.md) for the rationale.

```
Repository (query building, one per entity)
  ↓ depends on
DBAdapter interface  ──┬── PostgresAdapter (real, uses `pg`)
                        └── MockAdapter    (tests, records calls)
```

## DBAdapter ([`adapter.ts`](./adapter.ts))

```ts
interface DBAdapter {
  query<T>(sql: string, params?: unknown[]): Promise<T[]>
  queryOne<T>(sql: string, params?: unknown[]): Promise<T | null>
  transaction<T>(fn: (db: DBAdapter) => Promise<T>): Promise<T>
}
```

Repositories only ever depend on this interface — never on `pg` — so they can be unit tested with
`MockAdapter` and swapped onto a different driver later without touching repository code.

## PostgresAdapter ([`implementations/PostgresAdapter.ts`](./implementations/PostgresAdapter.ts))

Concrete implementation backed by `pg`'s connection pool. Reads `DATABASE_URL` by default:

```ts
const db = new PostgresAdapter(process.env.DATABASE_URL)
```

`transaction()` checks out a single client, runs `BEGIN`/`COMMIT`/`ROLLBACK` around the callback,
and passes the callback a `DBAdapter` bound to that same client so nested repository calls stay on
one connection.

### Local Postgres for development / integration tests

```bash
cd server
docker compose up -d   # starts Postgres on localhost:5432 (see docker-compose.yml)
cp .env.example .env   # DATABASE_URL already matches the compose defaults
npm run test:integration
```

Integration tests live under [`../../tests/integration`](../../tests/integration) and are excluded
from the default `npm test` run (see `testPathIgnorePatterns` in `package.json`) since they need a
live database — run them explicitly with `npm run test:integration`, or via CI once the fast/slow
test matrix (Epic 5) is wired up.

## Repositories ([`repositories/`](./repositories))

`TaskRepository`, `BoardRepository`, `UserRepository` — one per entity, each taking a `DBAdapter` in
its constructor and exposing `create`/`findById`/`find*`/`update`. `update()` builds its `SET` clause
from only the fields actually provided, so a partial update never touches untouched columns.

Unit tests (`*.spec.ts` next to each repository) use `MockAdapter` to assert the SQL/params a
repository sends, without a database.
