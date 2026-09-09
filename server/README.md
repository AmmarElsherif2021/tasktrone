# Tasktrone Server

NestJS backend for Tasktrone. Implements the hexagonal data layer (adapters/repositories/services/API)
for tasks and boards — see [../plan.md](../plan.md) for the original architecture proposal and
[../DECISION_LOG.md](../DECISION_LOG.md) for why it's built this way and what's still Supabase-only.

## Requirements

- Node.js 18+
- npm

## Running

```bash
cd server
npm install
npm run dev     # nest start --watch, http://localhost:3001
```

Other scripts:

```bash
npm run build   # compile to dist/
npm start       # run compiled dist/main.js
npm test        # run Jest unit tests
npm run lint    # eslint --fix on src/**/*.ts
```

## Environment variables

| Variable | Required | Default | Notes |
|---|---|---|---|
| `PORT` | no | `3001` | HTTP port the server listens on |
| `DATABASE_URL` | only for `PostgresAdapter` / integration tests | — | e.g. `postgres://tasktrone:tasktrone@localhost:5432/tasktrone`; matches `docker-compose.yml` defaults |

Copy `.env.example` to `.env` for local values. Nothing reads `.env` automatically yet (no NestJS
app wiring uses `PostgresAdapter` or `DATABASE_URL` at runtime yet — see DI/bootstrap wiring) —
`DATABASE_URL` is currently only consumed directly by `PostgresAdapter` and the integration tests.

## Local Postgres

```bash
docker compose up -d      # starts Postgres on localhost:5432
npm run test:integration  # runs tests/integration/** against it
```

See [`src/db/README.md`](src/db/README.md) for the adapter/repository layer this backs, and
[`docs/CI.md`](../docs/CI.md) for how (and when) these same tests run in CI.

## Wiring (adapter → repos → services)

[`src/bootstrap.ts`](src/bootstrap.ts) is the single factory that assembles the stack from
`DATABASE_URL`:

```ts
import { bootstrap } from './bootstrap'

const { taskService, boardService } = bootstrap(process.env.DATABASE_URL)

const board = await boardService.createBoard({ organizationId: orgId, name: 'Assembly Line 1' })
const task = await taskService.createTask({ boardId: board.id, title: 'Weld frame' })
```

`bootstrap()` doesn't open a database connection itself (`pg.Pool` connects lazily on first query),
so it's safe to call in fast unit tests too — see [`src/bootstrap.spec.ts`](src/bootstrap.spec.ts).
See [`src/services/README.md`](src/services/README.md) for what each service does, and
[`src/controllers/README.md`](src/controllers/README.md) for the actual HTTP routes and validation
behavior.

## Tests

Unit tests live next to their source file as `*.spec.ts` and run with Jest (no network/DB access).
Integration tests (against a real Postgres) will live under `server/tests/integration` and are
intended to run only on `main`/merge, not on every PR — see the CI workflow.

### Mocking the database in tests

Repositories depend only on the `DBAdapter` interface ([`src/db/adapter.ts`](src/db/adapter.ts)),
never on `pg` directly, so unit tests can inject `MockAdapter`
([`tests/mocks/MockAdapter.ts`](tests/mocks/MockAdapter.ts)) instead of hitting a real database:

```ts
import { MockAdapter } from '../../tests/mocks/MockAdapter'

const adapter = new MockAdapter()
adapter.mockNextResult([{ id: '1', title: 'Weld frame' }]) // what the next query() call returns

const repo = new TaskRepository(adapter)
const task = await repo.findById('1')

expect(adapter.calls[0].sql).toContain('SELECT')
```

See [`src/db/adapter.spec.ts`](src/db/adapter.spec.ts) for a runnable example.

### Test fixture factories

Fixtures across both test tiers come from three small factory modules instead of hand-written
literals, so the same defaults back every layer:

- **`tests/factories/entities/`** — `makeTask`/`makeBoard`/`makeUser` build valid, fully-populated
  domain entities (real UUIDs via `crypto.randomUUID()`, sensible field defaults). Used by
  repository/service/controller/DTO unit tests, and by the integration tests below, for both
  MockAdapter/mocked-repo return values and request/expected-response payloads. Pass overrides to
  vary only the field under test: `makeTask({ status: 'done' })`.
- **`tests/factories/db-row.factory.ts`** — `makeTaskRow`/`makeBoardRow`/`makeUserRow` build raw
  **snake_case** Postgres row shapes (`board_id`, `model_ref`, ...), i.e. what `pg` hands back
  *before* `toCamelCaseRow` ([`src/db/implementations/case-mapping.ts`](src/db/implementations/case-mapping.ts))
  maps it. Used only where a test stands in for the raw driver layer itself (see
  [`src/db/implementations/PostgresAdapter.spec.ts`](src/db/implementations/PostgresAdapter.spec.ts))
  — everywhere else (including MockAdapter-based repository tests, which sit above the case-mapping
  boundary) uses the entity factories instead.
- **`tests/integration/factories/`** — `seedBoard`/`seedTask`/`seedUser` insert a real row against a
  live Postgres through the matching repository (never raw SQL), defaulting fields from the same
  entity factories above. Used to arrange DB state in integration specs
  (`tests/integration/postgres-adapter.smoke.spec.ts`) ahead of the behavior actually under test.

```ts
import { makeTask } from '../../tests/factories/entities'

const task = makeTask({ status: 'in_progress' })
```

## Domain

Entities and DTOs (including validation) live under [`src/domain`](src/domain) — see
[`src/domain/README.md`](src/domain/README.md).
