# CI

Two workflows. [`server-lint-test.yml`](../.github/workflows/server-lint-test.yml) is split into a
fast job and a slow job — see [DECISION_LOG.md](../DECISION_LOG.md#4-unit-tests-mocked-vs-integration-tests-real-postgres-as-separate-suites)
for why they're kept separate rather than one suite. [`client-lint-test.yml`](../.github/workflows/client-lint-test.yml)
is a single fast job (the client has no integration-test tier yet — it has no direct database access).
Both also trigger on changes under `contracts/**`, since a schema-only edit can break either side.

## `server-lint-test.yml` → `lint-and-test` — every PR and push to `master`

Triggers on any PR or push touching `server/**` or `contracts/**`. Runs, in order: `npm ci`,
`npm run lint`, `npm test` (Jest unit tests only — `MockAdapter`/mocked repositories/mocked services,
no database). This is the job that gates merging; it has no external dependencies and should stay fast.

## `server-lint-test.yml` → `integration-tests` — push to `master` only

Gated with `if: github.event_name == 'push'` and `needs: lint-and-test`, so it never runs on a PR
and never runs if the fast job already failed. Spins up a `postgres:16-alpine` service container
(matching `server/docker-compose.yml`'s credentials: `tasktrone`/`tasktrone`/`tasktrone`), waits for
its healthcheck, then runs `npm run test:integration` — the specs under
[`server/tests/integration/`](../server/tests/integration) that exercise `PostgresAdapter` CRUD,
transaction commit/rollback, the full HTTP API happy path, and — since it needs a real database to
hit real endpoints — the server side of the [contract tests](../contracts/README.md) against a real
database.

## `client-lint-test.yml` → `lint-and-test` — every PR and push to `master`

Triggers on any PR or push touching `client/**` or `contracts/**`. Runs `npm ci`, `npm run lint`,
`npm test` (Vitest — component/context unit tests, plus the client side of the
[contract tests](../contracts/README.md), which only need a mocked `fetch`, not a real server).

## `client-lint-test.yml` → `e2e-tests` — every PR and push to `master`, optional/gated

Runs [`client/e2e/`](../client/e2e) (Playwright) against a real dev server, with Supabase auth and
the backend API mocked — see [`client/e2e/README.md`](../client/e2e/README.md) for why, and for a
couple of real timing pitfalls hit while writing these specs. Marked `continue-on-error: true`, so
it always reports a result but never blocks merging — mocking this much app state makes it more
prone to drifting out of sync with real UI changes than the suites above. The HTML report is
uploaded as a build artifact (`playwright-report`) on every run, pass or fail.

## Test fixture convention (both tiers)

Server-side fixtures come from three factory modules rather than hand-written literals, so both
tiers stay consistent as new tests are added — see
[`server/README.md`](../server/README.md#test-fixture-factories) for the full breakdown:

- `server/tests/factories/entities/` (`makeTask`/`makeBoard`/`makeUser`) — fully-populated domain
  entities, used across unit tests in every layer (repositories, services, controllers, DTOs) and
  as the source of request/response payloads in the integration tier below.
- `server/tests/factories/db-row.factory.ts` (`makeTaskRow`/`makeBoardRow`/`makeUserRow`) — raw
  snake_case rows standing in for `pg`'s pre-case-mapping output; used only in
  `PostgresAdapter.spec.ts`, the one unit spec that actually exercises that boundary.
- `server/tests/integration/factories/` (`seedBoard`/`seedTask`/`seedUser`) — insert a real row via
  the matching repository against a live Postgres, defaulting from the entity factories above; used
  by `integration-tests` job specs to arrange DB state ahead of the behavior under test.

## Finding logs

GitHub → **Actions** tab → the workflow run for your commit/PR → expand the job you want.
`integration-tests` only appears on runs triggered by a push to `master` (i.e. after a PR merges) —
it won't show up on a PR's checks at all, by design. For `e2e-tests`, download the `playwright-report`
artifact from the run and open its `index.html` for traces/screenshots of any failure.

## Running the same checks locally

```bash
# server
cd server
npm run lint
npm test                    # what lint-and-test runs
docker compose up -d        # what the CI Postgres service container replaces
npm run test:integration    # what integration-tests runs

# client
cd client
npm run lint
npm test                    # what client-lint-test's lint-and-test runs
npm run test:e2e            # what e2e-tests runs
```
