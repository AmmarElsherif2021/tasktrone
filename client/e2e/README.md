# E2E tests (Playwright)

`npm run test:e2e` — runs against a real `vite` dev server (auto-started by
[`playwright.config.js`](../playwright.config.js)), with Supabase auth and the backend API mocked
via route interception. No real Supabase project or running `server/` needed.

## Why mocked, not a real backend/Supabase

- **Auth**: `supabase-js` reads an existing session from `localStorage` before ever making a network
  call. Each spec seeds a fake session there directly (`seedFakeAuthSession`) rather than driving a
  real login, which would depend on a live external Supabase project being reachable and configured
  with a known test user — an external dependency this test suite shouldn't need to pass.
- **Backend**: `apiClient`'s calls to `/tasks`/`/boards` are intercepted and answered with fixtures,
  the same "mocked API" option `client/src/lib/apiClient.contract.test.js` uses — no need for
  `server/` or Postgres to be running.
- **"Create board"**: there's no UI flow for creating a board yet (still Supabase-sourced under
  `currentProject.boards`, no "new board" button in the app), so it's represented by the mocked
  project fixture already having one — the same way `server/tests/integration/http-api.smoke.spec.ts`
  creates a board via a direct API call before creating a task, rather than via UI.

## Pitfalls hit while writing this (left as comments in the spec, noted here too)

- **A bare `**/tasks**` route pattern also matches Vite's own dev-server requests** for local source
  files like `src/API/tasks.js` or `CreateTask.jsx` — it intercepted them and served JSON instead of
  JavaScript, breaking the whole app with a MIME-type error. Route patterns are scoped to the actual
  backend host (`http://localhost:3001/tasks**`) instead.
- **React Query's `retry: 2` and default `refetchOnWindowFocus`** mean a "fail once, then succeed"
  mock can self-resolve via a background refetch before an explicit "click Retry" ever happens — the
  error UI disappears out from under the test with a confusing "element was detached from the DOM"
  error. The retry test avoids this by never introducing a success response at all; it only proves
  clicking "Retry" issues a new request, since app recovery once the backend is healthy is already
  covered by the happy-path test.

## Running locally

```bash
npm run test:e2e            # headless, once
npx playwright test --ui    # interactive UI mode
npx playwright show-report  # view the HTML report from the last run
```

## In CI

Runs in [`.github/workflows/client-lint-test.yml`](../../.github/workflows/client-lint-test.yml)'s
`e2e-tests` job — optional/gated (`continue-on-error: true`), so a failure is visible as a check but
never blocks merging. Mocking this much app state makes these specs more prone to drifting out of
sync with real UI changes than the unit/contract suite, which is why they don't gate merges the way
`lint-and-test` does.
