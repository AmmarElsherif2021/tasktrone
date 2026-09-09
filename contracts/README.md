# Contracts

JSON Schema files describing the HTTP response shapes `server/` and `client/` both need to agree on.
Single source of truth at the repo root (not duplicated per-package) since these two npm packages
aren't set up as an npm/yarn workspace — both sides read these files by relative filesystem path from
their own tests.

- [`task.schema.json`](./task.schema.json) — `server/src/domain/task.entity.ts`
- [`board.schema.json`](./board.schema.json) — `server/src/domain/board.entity.ts`

## Who checks what

- **Server**: [`server/tests/integration/contract.spec.ts`](../server/tests/integration/contract.spec.ts)
  hits the real HTTP API (`POST /boards`, `POST /tasks`) against a real Postgres and validates the
  JSON response against these schemas with `ajv`. Runs in the main-only `integration-tests` CI job
  (see [`docs/CI.md`](../docs/CI.md)) since it needs a database.
- **Client**: [`client/src/lib/apiClient.contract.test.js`](../client/src/lib/apiClient.contract.test.js)
  validates that the shape `apiClient`'s callers (`ProjectContext`, `CreateTask`) actually consume
  matches these same schemas, with a mocked `fetch`. Runs as a normal fast test.

If a field is renamed or removed on either side, whichever test reads real/expected data that no
longer matches the schema fails — that's the whole point. Update the schema *and* both tests together
when the shape intentionally changes.

## Why JSON Schema instead of OpenAPI

A full OpenAPI spec (e.g. via `@nestjs/swagger`) would also document every endpoint's request shape,
error responses, and auth — more complete, but more machinery (decorators on every DTO, a generator
step) than this project needs yet for two entities. JSON Schema + `ajv` on both sides catches the
actual regression this task cares about (client and server silently disagreeing on a response shape)
with far less setup. Revisit if/when the API surface grows enough to want generated client types too.
