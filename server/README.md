# Tasktrone Server

NestJS backend for Tasktrone. Currently a minimal skeleton (health check only) — the hexagonal
data layer (adapters/repositories/services/API) lands in subsequent tasks; see [../plan.md](../plan.md)
for the architecture and [../DECISION_LOG.md](../DECISION_LOG.md) (once written) for rationale.

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
| `DATABASE_URL` | not yet used | — | Postgres connection string; wired in once `PostgresAdapter` lands |

No `.env` file is read yet — variables are picked up from the process environment. A loader
(e.g. `@nestjs/config`) will be added alongside the DB adapter work if needed.

## Tests

Unit tests live next to their source file as `*.spec.ts` and run with Jest (no network/DB access).
Integration tests (against a real Postgres) will live under `server/tests/integration` and are
intended to run only on `main`/merge, not on every PR — see the CI workflow.
