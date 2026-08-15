import { expect, test } from '@playwright/test'

/**
 * Happy path: create task -> task visible in the board UI.
 *
 * There's no UI flow to create a *board* yet (boards are still Supabase-sourced under
 * currentProject.boards, with no "new board" button anywhere in the app) — so "create
 * board" is represented by the mocked project fixture already having one, the same way
 * server/tests/integration/http-api.smoke.spec.ts creates a board via a direct API call
 * before creating a task, rather than via UI.
 *
 * Auth: supabase-js reads an existing session from localStorage before ever making a
 * network call, so a session is seeded there directly rather than driving a real login
 * (which would depend on a live external Supabase project). The new backend's /tasks and
 * /boards are mocked via route interception too — see DECISION_LOG.md #5 for why the app
 * talks to two backends right now.
 */

const SUPABASE_PROJECT_REF = 'cumgxqrbbsjizloxlsaw' // matches VITE_SUPABASE_URL in client/.env
const BACKEND_URL = 'http://localhost:3001' // matches VITE_BACKEND_URL in client/.env
const TEST_USER = { id: 'e2e-test-user-0000-0000-000000000000', email: 'e2e@tasktrone.test' }
const TEST_PROJECT_ID = '22222222-2222-4222-8222-222222222222' // doubles as boardId (see DECISION_LOG.md #5)

function fakeJwt(payload) {
  const base64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url')
  return `${base64url({ alg: 'HS256', typ: 'JWT' })}.${base64url(payload)}.fake-signature`
}

async function seedFakeAuthSession(page) {
  const now = Math.floor(Date.now() / 1000)
  const session = {
    access_token: fakeJwt({ sub: TEST_USER.id, email: TEST_USER.email, exp: now + 3600 }),
    refresh_token: 'fake-refresh-token',
    expires_at: now + 3600,
    expires_in: 3600,
    token_type: 'bearer',
    user: {
      id: TEST_USER.id,
      email: TEST_USER.email,
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
    },
  }
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [`sb-${SUPABASE_PROJECT_REF}-auth-token`, JSON.stringify(session)],
  )
}

async function mockSupabaseRest(page) {
  const supabaseRest = `https://${SUPABASE_PROJECT_REF}.supabase.co/rest/v1`

  // The board this test's task gets created on — enough of a project fixture for
  // Board.jsx to render (it gates on `currentProject` being truthy).
  await page.route(`${supabaseRest}/projects**`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: TEST_PROJECT_ID,
        title: 'E2E Test Project',
        wip_limit: 5,
        boards: [{ id: TEST_PROJECT_ID, name: 'Main Board', phase: 'production' }],
        project_members: [],
      }),
    }),
  )
  // Everything else Supabase-backed (posts, users, project membership queries triggered
  // by Header/UserHomeContext) — safe empty responses, not this test's concern.
  await page.route(`${supabaseRest}/**`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )
}

async function mockBackendApi(page) {
  const tasks = []
  // Scoped to the backend's own host — a bare '**/tasks**' also matches Vite's dev-server
  // requests for local source files like src/API/tasks.js or CreateTask.jsx, intercepting
  // them and serving JSON instead of JavaScript (breaks the whole app with a MIME error).
  await page.route(`${BACKEND_URL}/tasks**`, async (route) => {
    const req = route.request()
    if (req.method() === 'GET') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(tasks) })
      return
    }
    if (req.method() === 'POST') {
      const body = req.postDataJSON()
      const task = {
        id: `t${tasks.length + 1}`,
        boardId: body.boardId,
        title: body.title,
        description: body.description ?? null,
        status: 'todo',
        position3d: { x: 0, y: 0, z: 0 },
        modelRef: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      tasks.push(task)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(task) })
      return
    }
    await route.continue()
  })
}

test('create task -> task visible in the board UI', async ({ page }) => {
  await seedFakeAuthSession(page)
  await mockSupabaseRest(page)
  await mockBackendApi(page)

  await page.goto(`/project/${TEST_PROJECT_ID}/board`)

  // The initial "Loading project board..." skeleton is shown only for the single render
  // before ProjectShell's effect sets currentProjectId — too transient to reliably assert
  // on. Go straight to waiting for the real board.
  await expect(page.getByRole('heading', { name: 'To Do' })).toBeVisible({ timeout: 10_000 })

  await page.getByRole('button', { name: /create task/i }).click()
  await page.getByPlaceholder('Enter task title').fill('Weld frame')
  await page.getByRole('button', { name: /^create task$/i }).click()

  // Modal closes and the task shows up in the To Do column.
  await expect(page.getByPlaceholder('Enter task title')).not.toBeVisible()
  await expect(page.getByRole('heading', { name: 'Weld frame', level: 6 })).toBeVisible()
})

test('shows an error and a working retry when the backend call fails', async ({ page }) => {
  await seedFakeAuthSession(page)
  await mockSupabaseRest(page)

  // Fail every GET, unconditionally, for the whole test — never introduce a success
  // response. Board.jsx's own background refreshTasks() (500ms after mount) and React
  // Query's default refetchOnWindowFocus both fire refetches independent of this test's
  // click; while a query stays in an error state, isError stays true across those extra
  // attempts (it only clears on an actual success), so the Alert/Button stay stably
  // mounted throughout — which is what makes this deterministic. (An earlier version of
  // this test pre-swapped the mock to succeed before clicking, and a background refetch
  // would race the click and consume that success first, detaching the button mid-click.)
  let getRequests = 0
  await page.route(`${BACKEND_URL}/tasks**`, async (route) => {
    if (route.request().method() !== 'GET') return route.continue()
    getRequests += 1
    await route.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"boom"}' })
  })

  await page.goto(`/project/${TEST_PROJECT_ID}/board`)

  await expect(page.getByText(/couldn.?t load tasks/i)).toBeVisible({ timeout: 15_000 })
  const requestsBeforeRetry = getRequests

  await page.getByRole('button', { name: 'Retry' }).click()

  // Proves the button is actually wired to refreshTasks(), not just decorative — the app
  // recovering once the backend is healthy again is already covered by the happy-path test.
  await expect.poll(() => getRequests).toBeGreaterThan(requestsBeforeRetry)
})
