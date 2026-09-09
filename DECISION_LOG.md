# Decision Log

Architecture decisions for the `server/` hexagonal-foundation rebuild, and how the new backend
coexists with the pre-existing Supabase-backed client during the migration. Each entry lists the
alternatives considered and the tradeoffs, not just the final call — so a later decision can be
revisited without re-litigating context that's already been thought through.

---

## 1. Repository + Adapter (hexagonal) over a bare query layer or a full ORM

**Decision**: Domain code depends only on a `DBAdapter` interface (`query`/`queryOne`/`transaction`).
Repositories (`TaskRepository`, `BoardRepository`, `UserRepository`) build SQL and depend on
`DBAdapter`, never on `pg` directly. Services depend on repositories, never on the adapter.

**Alternatives considered**:
- **Adapter only, no repository layer** — routes/services call `db.query()` directly. Rejected:
  query strings and parameter-building end up duplicated or scattered, and there's no single place
  to unit-test "does this repository send the SQL I expect."
- **Full ORM (TypeORM/Prisma)** — less boilerplate for CRUD. Rejected for this phase: the schema is
  still small and changing fast (Board/Task/User only), and an ORM's migration/entity-decorator
  machinery is more to learn and fight than the SQL itself is to write by hand right now. Worth
  revisiting once the schema stabilizes and grows (e.g. once Project/RBAC/audit-trail entities land).
- **Direct Supabase client calls everywhere** (what the client still does for non-task data) —
  fastest to prototype, but couples every caller to Supabase's specific client API and RLS model,
  making a future driver swap (or a move off Supabase entirely) a full rewrite instead of a new
  adapter.

**Tradeoffs accepted**: more files per feature (interface + adapter + repository + service) than a
single query-per-route script would need. In exchange: repositories are unit-testable with
`MockAdapter` (no database), and swapping Postgres for something else later is a new adapter, not a
rewrite of every caller.

---

## 2. Postgres (via Docker Compose) as the initial database, not Supabase

**Decision**: The new backend talks to a plain Postgres instance (`server/docker-compose.yml`)
through `PostgresAdapter` (built on `pg`), not to Supabase.

**Alternatives considered**:
- **Point the new backend at Supabase directly** — would keep one database for the whole app.
  Rejected for now: the client's existing Supabase schema (projects, posts, manufacturing phases,
  RBAC, task members) is much richer than the new hexagonal backend's minimal Task/Board/User model,
  and the whole point of this rebuild is to *not* inherit that schema's shape and coupling wholesale.
  Building against a clean local Postgres keeps the new schema honest about what it actually models
  today, instead of silently depending on Supabase-specific columns/enums from day one.
- **SQLite for local dev** — even less setup than Docker. Rejected: `position3d` and future JSON-ish
  fields want native `jsonb`, and staying on the same engine as the eventual target avoids a second
  "does this SQL even work on the real database" surprise later.

**Tradeoffs accepted**: two databases exist side by side during the migration (see decision 5) —
more moving parts for local dev (`docker compose up -d` is a manual step) and no free real-time
subscriptions or RLS the way Supabase gives you. Migration notes: if/when the client's Supabase data
model is retired in favor of the new backend, the natural end states are either (a) point
`PostgresAdapter` at the same physical Postgres Supabase already runs on, keeping this adapter layer
as-is, or (b) keep two databases permanently and make `Project`/`User`/`RBAC` first-class in the new
backend instead. Neither has been decided — this log entry exists so that choice isn't made silently.

---

## 3. TypeScript for the server, JavaScript for the client

**Decision**: `server/` is TypeScript (strict mode). `client/` stays plain JS/JSX, matching what was
already there.

**Alternatives considered**:
- **TypeScript everywhere** — end-to-end type safety, including a shared types package for
  request/response shapes. Rejected for now: the client is a large pre-existing JS codebase (~80
  files); migrating it to TS is a project of its own and not a prerequisite for the backend to exist.
  Revisit once `client/src/API/*`'s Supabase-direct calls are fully replaced by `apiClient` — at that
  point a shared `@tasktrone/api-types` package (generated from the server's DTOs) becomes cheap and
  high-value, and is the natural point to introduce TS on the client too.
- **JavaScript for the server too** — would match the client and skip a build step. Rejected:
  NestJS's DI and decorators (`@Controller`, `@Injectable`, the DTO validation pipeline) lean heavily
  on TypeScript types and metadata; writing it in JS fights the framework more than it saves.

**Tradeoffs accepted**: no compile-time guarantee that `apiClient.post('/tasks', {...})`'s payload
shape matches `CreateTaskDto` — that gap is exactly what task #20 (contract tests) exists to catch
at test time instead.

---

## 4. Unit tests (mocked) vs. integration tests (real Postgres) as separate suites

**Decision**: `npm test` (Jest, server; Vitest, client) runs only unit tests — repositories tested
against `MockAdapter`, services tested against mocked repositories, controllers tested against
mocked services. Tests that need a real database live under `server/tests/integration/` and are
excluded from `npm test` via `testPathIgnorePatterns`; they run via `npm run test:integration`.

**Alternatives considered**:
- **One test suite, everything against a real (test) Postgres** — closer to production behavior for
  every test. Rejected: the server-lint-test CI job runs on every PR and needs to stay fast and not
  depend on a database being reachable; conflating the two would either slow down every PR or make
  the fast job flaky when Postgres isn't available.
- **Mock the database for everything, including the adapter itself** — fastest possible, but then
  nothing ever exercises real SQL against a real Postgres, so a syntax error or type mismatch in a
  repository's query wouldn't surface until it hit production.

**Tradeoffs accepted**: the integration suite needs `docker compose up -d` to run locally and isn't
wired into CI yet (that's task #22 — a main-only CI job is the intended next step, not implemented
as of this entry). Until then, integration tests are a local-only safety net, not a CI gate.

---

## 5. Incremental migration: new backend owns tasks/boards, Supabase keeps everything else

**Decision**: `ProjectContext` now fetches tasks through `apiClient` (the new backend), using
`currentProjectId` as `boardId` since the new backend has no `Project` entity yet. Project details,
project members, posts, and users still go through the original Supabase-backed
`client/src/API/*.js` calls, restored from git history rather than rewritten against the new backend.

**Alternatives considered**:
- **Migrate everything to the new backend in one step** — cleaner end state, but the new backend's
  Task/Board/User model has no equivalent yet for posts, project membership, or manufacturing-phase
  metadata; building all of that first would block shipping the parts that *are* ready (tasks/boards)
  for an indefinite, much larger unit of work.
- **Keep everything on Supabase, don't wire the new backend into the client at all** — avoids running
  two data sources, but then the backend built in tasks #1-#10 has no real caller exercising it
  end-to-end, and integration bugs (like the tsconfig `rootDir` build-output bug found while wiring
  the HTTP API) surface later and more expensively.

**Tradeoffs accepted**: two backends are live at once. Fields the old Supabase-shaped consumers
expect (`manufacturingPhase`, `priority`, `leadTime`, `taskCategory`, task members, requirements,
attachments) are present in the mapped shape but always `undefined`/empty, since the new backend
doesn't have them yet — documented inline in `ProjectContext.jsx` and in the `CreateTask` form's
notice banner so this reads as deliberate, not broken. Migration note: the natural next steps are
(a) give the new backend a `Project` entity so `currentProjectId` stops being an alias for `boardId`,
then (b) move posts/members/users over one at a time the same way tasks were.
