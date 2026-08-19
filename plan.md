Revised issues and tasks (PM-ready) — grouped by epic, with acceptance criteria, labels, estimates
Notes: Est = rough size (S/M/L). Labels are comma-separated. Milestone names match your existing milestones.

Epic 1: Hexagonal Foundation (milestone: Epic 1: Hexagonal Foundation)

1. Create server skeleton & CI job (Est: M)

- Description: Add server/ scaffold (server/package.json, server/README, basic lint/test scripts). Add a CI workflow that runs server lint and unit tests.
- Acceptance criteria:
  - server/package.json exists with scripts: dev, start, test, lint.
  - server/README documents how to run server locally and run tests.
  - GitHub Actions job runs server tests on push.
- Labels: epic:1,backend,infra

2. Define DBAdapter interface and unit test contract (Est: S)

- Description: Define adapter interface (DBAdapter) that repositories depend on. Provide a MockAdapter used in unit tests.
- Acceptance criteria:
  - DBAdapter file exported with clear method surface (CRUD semantics or query/queryOne semantics).
  - Example unit test demonstrates injecting MockAdapter into a repository test.
- Labels: epic:1,backend,architecture,testing

3. Implement PostgresAdapter (Est: M)

- Description: Concrete adapter using node-postgres (pg) that implements DBAdapter.
- Acceptance criteria:
  - PostgresAdapter implements DBAdapter methods and reads DB connection from env (DATABASE_URL or POSTGRES_* vars).
  - Integration smoke test inserts/reads rows against a local Postgres (Docker Compose or Testcontainers) and passes.
- Labels: epic:1,backend,db,postgres,testing

4. Create Repository layer (BoardRepo, TaskRepo, UserRepo) that depends on DBAdapter (Est: M)

- Description: Implement server/src/db/repositories/*.js that only depend on DBAdapter.
- Acceptance criteria:
  - Repos implement domain persistence methods used by services (find/create/update).
  - Unit tests use MockAdapter to assert repository behavior (no direct driver calls).
  - Repositories do not import pg or other driver code.
- Labels: epic:1,backend,domain,architecture,testing

5. DI/bootstrap wiring (adapter → repos → services) (Est: S)

- Description: Provide a bootstrap factory that constructs the PostgresAdapter, instantiates repositories with it, and exports service instances for controllers.
- Acceptance criteria:
  - server bootstrap demonstrates wiring and uses env vars to configure PostgresAdapter.
  - README snippet documents how to run server with local Postgres.
- Labels: epic:1,backend,architecture

Epic 2: Minimal Core Backend (milestone: Epic 2) 6) Define domain entities and DTOs (Board, Task, User) including position3d (Est: S)

- Description: Add plain JS/TS domain objects and DTO validation (class-validator or Joi) for Task with position3d.
- Acceptance criteria:
  - server/src/domain contains entity/DTO definitions; DTO validation schema exists.
  - Tests validate DTOs reject invalid input and accept valid position3d values.
- Labels: epic:2,backend,domain,api,testing

7. Implement services/use-cases depending on repositories (Est: M)

- Description: TaskService and BoardService should accept repository interfaces in constructor and contain business rules.
- Acceptance criteria:
  - Services only depend on repository interfaces, not adapters.
  - Unit tests use mocked repositories to validate business logic and error cases.
- Labels: epic:2,backend,service,testing

8. Thin HTTP API + DTO validation (POST /boards, GET /boards/:id, POST /tasks, GET /tasks?boardId=, PATCH /tasks/:id) (Est: M)

- Description: Implement routes that call services, validate input, and return consistent JSON.
- Acceptance criteria:
  - Endpoints respond with correct status codes and JSON shapes.
  - Integration tests (supertest) cover create -> fetch happy path for boards/tasks using a test Postgres DB.
  - Validation errors return consistent error shape and status.
- Labels: epic:2,backend,api,testing

9. Add global error mapping middleware (Est: S)

- Description: Translate domain errors to HTTP codes with consistent error payload.
- Acceptance criteria:
  - Middleware exists and tests assert NotFound -> 404, ValidationError -> 400, generic -> 500.
- Labels: epic:1,backend,api,testing

Epic 3: 3D Board Prototype (milestone: Epic 3) 10) Ensure Task API supports position3d (Est: S)

- Description: Add position3d to create/update DTOs and persisted task shape.
- Acceptance criteria:
  - POST/PATCH accept position3d and GET /tasks returns it.
  - Integration test asserts position3d persisted and returned.
- Labels: epic:3,frontend,api,integration,testing

Epic 4: Frontend-Backend Integration (milestone: Epic 4) 11) Add client/src/lib/apiClient.js (Est: S)

- Description: Small centralized API client (get/post/patch) reading VITE_BACKEND_URL.
- Acceptance criteria:
  - apiClient exposes get/post/patch.
  - Client tests mock apiClient and confirm it's used by ProjectContext.
- Labels: epic:4,frontend,integration,testing

12. Wire ProjectContext to backend via apiClient & React Query (Est: M)

- Description: Replace mocks with real API fetches and expose loading/error states.
- Acceptance criteria:
  - ProjectContext loads board and tasks from backend and exposes them to consumers.
  - Skeletons and error UI shown appropriately; retry option present.
  - Tests validate context behavior using MSW or mocked apiClient.
- Labels: epic:4,frontend,integration,testing

13. Submit new tasks from CreateTask to backend (Est: S)

- Description: CreateTask posts to /tasks with default position3d when omitted.
- Acceptance criteria:
  - After create, next fetch shows the new task.
  - Form displays validation errors when backend returns 4xx.
- Labels: epic:4,frontend,integration,testing

Epic 5: Prototype Hardening & Demo Readiness (milestone: Epic 5) 14) DECISION_LOG.md capturing hexagonal decisions & Postgres rationale (Est: S)

- Description: Document adapter/repository decision, Postgres vs alternatives, and testing strategy.
- Acceptance criteria:
  - DECISION_LOG.md contains at least 3 decision entries with alternatives and tradeoffs.
- Labels: epic:5,docs

15. Create issues & milestones (this refined batch) (Est: S)

- Description: Convert the revised plan into GitHub Issues and Milestones (this batch).
- Acceptance criteria:
  - Issues created with labels & milestones applied.
- Labels: epic:5,project-management

Testing backlog (concrete tasks & acceptance)
A) Unit tests for services (Est: M)

- What: Jest (or preferred) tests for TaskService and BoardService using mocked repositories.
- Acceptance:
  - CI job runs unit tests; coverage threshold set (e.g., 80%).
  - Tests do not touch network or DB.

B) Repository unit tests with MockAdapter (Est: S)

- What: Tests assert repository method params produce expected adapter calls; use a FakeAdapter that records calls.
- Acceptance:
  - Tests assert expected calls made; no DB dependency.

C) Adapter integration tests against Postgres (Est: M)

- What: Use Docker Compose or Testcontainers to bring up a local Postgres for integration tests of PostgresAdapter.
- Acceptance:
  - Tests run in CI with a disposable Postgres (or run in a separate integration job).
  - Tests insert/read/clean up data.

D) API integration tests (supertest) (Est: M)

- What: Start server in test mode, run create board -> create task -> fetch tasks; assert JSON shapes and codes.
- Acceptance:
  - Tests pass using the test Postgres DB and clean up after run.

E) Contract tests between client apiClient and backend (Est: S)

- What: A simple OpenAPI or assertion tests ensuring task shape (including position3d) matches client expectations.
- Acceptance:
  - Contract tests pass in CI.

F) Frontend E2E (Playwright/Cypress) (Est: L)

- What: End-to-end happy path: create board -> create task -> task visible in UI.
- Acceptance:
  - Runs headless in CI (optionally gated), asserts visible UI elements and load/error flows.

G) CI/test matrix (fast vs integration) (Est: S)

- What: CI separates quick unit tests (mock adapters) from longer integration tests (DB).
- Acceptance:
  - Fast job runs on every PR; integration job runs on main or nightly.

Concrete infra/ops and repo consistency actions

- Replace or update compose.yaml to run Postgres locally (postgres:latest) instead of mongo. Add DB env vars (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) and a service for the backend that points to DATABASE_URL or POSTGRES_*.
- Add server/package.json with dependency "pg" (node-postgres) and test tooling (jest, supertest). Update root .lintstagedrc.js to include server patterns.
- Document required env vars in server/README (DATABASE_URL, NODE_ENV, JWT secrets if used).
- Use DATABASE_URL with the form: postgres://user:password@host:5432/dbname for PostgresAdapter configuration.

PM task-log template (useable in GitHub issues or project boards)

- Task card fields:
  - Title
  - Assignee
  - Est (S/M/L)
  - Priority (P0/P1/P2)
  - Status (todo/in-progress/review/done)
  - Acceptance criteria (copy from above)
  - Notes (blockers, env choices)
  - CI requirement (unit/integration)

Risks and decisions to confirm

- Confirm Postgres for local dev — you confirmed this; next: do you want to keep Supabase references in README for later production/migration?
- TypeScript vs JavaScript for server: TS yields stronger domain modeling but increases initial setup time. If you want fast iteration, start JS and migrate to TS before the API stabilizes.
- CI capability: do you want integration tests to run on PRs (slower) or only on main/merge?
