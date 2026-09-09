# Tasktrone

Production Kanban for modern manufacturing — a focused Kanban system that brings WIP enforcement, quality gates, equipment tracking and immutable change history to assembly-line workflows.

## What this repo contains (short)

- A production-ready React client (client/) implemented in JavaScript.
- A backend server scaffold planned as a NestJS TypeScript application (server/) that follows a hexagonal (ports & adapters) architecture — Postgres is the local DB for initial phases.
- Project-level docs, plan and delivery artifacts (plan.md, DECISION_LOG.md).

---

## Stack

- Languages: JavaScript (client), TypeScript (server / NestJS)
- Backend runtime: Node.js + NestJS (TypeScript)
- Database (local/dev): PostgreSQL (initial phases)
- Frontend: React (Vite), React Query
- Testing: Jest for unit tests, Supertest for HTTP integration; Playwright/Cypress for optional E2E; integration tests run only on main/merge

Notable libraries (representative)

- pg (node-postgres) — Postgres client for the PostgresAdapter
- nestjs (server) — TypeScript framework with DI for service wiring
- react, vite, @tanstack/react-query — client stack
- jest, supertest, msw / testcontainers — testing & harnesses

---

## Architecture overview (hexagonal)

- Adapter (DBAdapter) — a small DB-agnostic interface that exposes the minimal persistence surface (CRUD or query/queryOne).
- Concrete Adapter — PostgresAdapter (node-postgres) implements DBAdapter; reads DATABASE_URL from env.
- Repositories — domain-facing persistence classes (TaskRepository, BoardRepository, UserRepository) that accept a DBAdapter instance and implement domain queries.
- Services / Use Cases — TaskService / BoardService accept repositories and contain business rules and validation.
- Controllers (HTTP) — thin controllers map DTOs -> services -> responses and rely on global error mapping middleware.
- Tests — repositories and services are unit-tested with MockAdapter/MockRepository. Concrete PostgresAdapter and API integration tests run against a disposable Postgres and are executed only on main/merge in CI.

How it fits: controllers call services; services call repositories; repositories call DBAdapter; DBAdapter talks to the driver. This keeps domain logic independent of any DB driver, enabling test doubles and migration.

---

## Getting started (local development)

Prereqs

- Node.js (>=18)
- Docker (for local Postgres in compose)
- Yarn or npm

1. Clone

```bash
git clone https://github.com/AmmarElsherif2021/tasktrone.git
cd tasktrone
```

2. Start local Postgres (recommended: Docker Compose)

- The repo includes a sample compose (update if needed). Example minimal compose snippet:

```yaml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: tasktrone
      POSTGRES_PASSWORD: tasktrone
      POSTGRES_DB: tasktrone_dev
    ports:
      - "5432:5432"
```

Set your DATABASE_URL locally:

```bash
export DATABASE_URL=postgres://tasktrone:tasktrone@localhost:5432/tasktrone_dev
```

3. Server (NestJS / TypeScript) — scaffold

- The server implementation lives under server/. It uses TypeScript and NestJS.
- Install & run:

```bash
cd server
npm install
npm run start:dev   # or npm run build && npm run start
```

4. Client (React / JS)

```bash
cd client
npm install
npm run dev
# open http://localhost:5173 (or the port Vite reports)
```

---

## Running tests

- Unit tests (fast): run on every PR
  - Server unit tests (Jest, mocks): run locally:
    ```bash
    cd server
    npm run test
    ```
  - Client unit tests / component tests:
    ```bash
    cd client
    npm run test
    ```

- Integration tests (Postgres, adapter & API):
  - These run only on main/merge in CI. Locally you can run them after starting a disposable Postgres instance:
    ```bash
    # in server
    npm run test:integration
    ```
  - Integration tests require DATABASE_URL pointing to a disposable DB and will clean up after themselves.

- E2E (optional):
  - Playwright / Cypress scripts live under server/tests/e2e or client/e2e depending on configuration. These are optional to run locally and may be gated in CI.

---

## Development notes & conventions

- Hexagonal architecture is enforced: repositories depend only on DBAdapter; services depend only on repositories; controllers depend only on services.
- TypeScript is used for the backend (NestJS) to enforce domain types; frontend is JavaScript (React) to match current codebase and speed iteration.
- No Supabase integration yet — it is intentionally staged as a production/hosting option. The README and DECISION_LOG.md will capture migration steps if you choose Supabase later.
- Integration tests (Postgres adapter + API) are heavier and thus run only on main/merge to keep PR feedback fast. Unit tests use MockAdapter and are run on PRs.

---

## Environment variables (server)

- DATABASE_URL — postgres connection string (postgres://user:pass@host:5432/db)
- NODE_ENV — development | test | production
- JWT_SECRET — if auth is enabled (configure later)
- PORT — server HTTP port (default 3000)

Document additional env vars in server/README.md when implemented.

---

## Project tasks & testing policy (summary)

- Implement DBAdapter → PostgresAdapter → Repositories → Services → Controllers.
- Create unit tests for services and repositories with mocks (run on PRs).
- Run adapter & API integration tests (requiring Postgres) only on main/merge in CI.
- Maintain DECISION_LOG.md with architectural decisions and tradeoffs (Postgres chosen initially; Supabase staged as option).

---

## Contributing

- Open an issue for non-trivial changes, link the relevant epic milestone.
- Follow the hexagonal pattern for persistence changes.
- Add tests: unit tests for logic; integration tests for any adapter/DB changes (integration tests must be documented and gated to main).
- Use PR titles that include the epic tag e.g., "[epic:1] Implement PostgresAdapter".

---
