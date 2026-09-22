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
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  queryOne<T>(sql: string, params?: unknown[]): Promise<T | null>;
  transaction<T>(fn: (db: DBAdapter) => Promise<T>): Promise<T>;
}
```

Repositories only ever depend on this interface — never on `pg` — so they can be unit tested with
`MockAdapter` and swapped onto a different driver later without touching repository code.

## PostgresAdapter ([`implementations/PostgresAdapter.ts`](./implementations/PostgresAdapter.ts))

Concrete implementation backed by `pg`'s connection pool. Reads `DATABASE_URL` by default:

```ts
const db = new PostgresAdapter(process.env.DATABASE_URL);
```

`transaction()` checks out a single client, runs `BEGIN`/`COMMIT`/`ROLLBACK` around the callback,
and passes the callback a `DBAdapter` bound to that same client so nested repository calls stay on
one connection.

### snake_case → camelCase

Table/column names are snake_case (`board_id`, `model_ref`, `created_at`); the domain entities
(`Task`, `Board`, `User`, `Product`, `BomItem`) are camelCase. Repositories write plain
`SELECT *` / `RETURNING *` with no per-column aliasing — `PostgresAdapter` converts every row's
top-level keys via [`implementations/case-mapping.ts`](./implementations/case-mapping.ts) before
returning them, so this only has to be handled in one place instead of in every query. It does
**not** recurse into JSONB values (`position3d`'s `{x,y,z}` keys are left as-is). `MockAdapter`
doesn't need this — tests queue already-camelCase fixtures directly, so there's no snake_case to
convert.

### camelCase → snake_case --newly added: 9/10/26

When writing or updating records in the database, objects with camelCase keys must be converted to
snake_case. The `toSnakeCase` function in
[`implementations/case-mapping.ts`](./implementations/case-mapping.ts) performs this conversion.
It's used by [`./tests/factories/db_row.factory.ts`](./tests/factories/db_row.factory.ts), and
`BOMItemRepository.update()` also calls it directly to build a dynamic `SET` clause from whichever
fields were actually passed in.

### Local Postgres for development / integration tests

```bash
cd server
docker compose up -d   # starts Postgres on localhost:5432 (see docker-compose.yml)
cp .env.example .env   # DATABASE_URL already matches the compose defaults
npm run test:integration
```

Integration tests live under [`../../tests/integration`](../../tests/integration) and are excluded
from the default `npm test` run (see `testPathIgnorePatterns` in `package.json`) since they need a
live database — run them explicitly with `npm run test:integration`, or via the `integration-tests`
CI job (main-only, see [`../../../docs/CI.md`](../../../docs/CI.md)).

## Repositories ([`repositories/`](./repositories))

`TaskRepository`, `BoardRepository`, `UserRepository`, `ProductRepository`, `BOMItemRepository` —
one per entity, each taking a `DBAdapter` in its constructor and exposing
`create`/`findById`/`find*`/`update`. `update()` is meant to build its `SET` clause from only the
fields actually provided, so a partial update never touches untouched columns; `BOMItemRepository`
does this generically via `toSnakeCaseRow`, while `BoardRepository` hand-writes the same
single-field pattern for `name`.

- `ProductRepository` — `create`/`findById`/`findByBoard`/`update`/`delete`, scoped by `boardId`.
- `BOMItemRepository` — `create`/`findById`/`findByProduct`/`update`/`delete`, scoped by
  `productId`. `create` defaults `unitCost` to `0` when omitted rather than leaving it `NULL`.

Unit tests (`*.spec.ts` next to each repository) use `MockAdapter` to assert the SQL/params a
repository sends, without a database.

## Known issues — `ProductRepository`

As currently written, `ProductRepository.ts` is not yet functional and shouldn't be treated as a
working reference for the `Product` table:

- `create`, `findById`, `findByBoard`, and `update` all query the `boards` table instead of
  `products`, and `create`/`findByBoard` bind against `board_id`/`boardId` columns rather than
  `product`-specific ones — these are almost certainly copy-paste leftovers from
  `BoardRepository` and need to target `products`.
- `update()` only accepts and persists `name` (`Partial<Pick<Product, "name">>`), even though
  `UpdateProductInput` (and `UpdateProductDto` in `../../domain`) define a much larger set of
  updatable fields (`description`, `currentStage`, `active_3d_model_url`, `targetBudget`,
  `ownerId`, `version`, `archivedAt`). None of those are wired into the SQL yet.
- `delete()` is the one method that does target `products`, and it soft-deletes by setting
  `archived_at`/`updated_at` rather than removing the row — a different delete semantic than
  `BoardRepository` and `BOMItemRepository`, which both hard-delete. This looks intentional
  (products get archived, not destroyed) but is worth confirming against Tier 2's schema-migration
  plan so the soft-delete convention is applied consistently.

## Known issues — `BOMItemRepository`

- `create()`'s failure branch throws `Error("Failed to create task")` — a copy-paste error message
  left over from `TaskRepository`; should read "Failed to create BOM item".
- `UpdateBOMItemInput` only covers `name`, `quantity`, and `unitCost` — `totalPrice` isn't
  updatable through the repository even though `UpdateBOMItemDTO` accepts it at the API layer.
