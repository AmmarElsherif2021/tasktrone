/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock everything ProjectContext talks to so this test never hits a real
// network or Supabase client — including the fetch-backed apiClient, per the
// task's "tests use MSW or mocked apiClient" requirement.
vi.mock('../lib/apiClient', () => ({ get: vi.fn() }))
vi.mock('../API/projects', () => ({
  getProjectById: vi.fn().mockResolvedValue({ id: 'p1', name: 'Test Project' }),
  updateProject: vi.fn(),
}))
vi.mock('../API/posts', () => ({ getPosts: vi.fn().mockResolvedValue([]) }))
vi.mock('../API/users', () => ({ getAllUsers: vi.fn().mockResolvedValue([]) }))
vi.mock('./AuthContext', () => ({
  useAuth: () => ({ user: { id: 'u1' }, isAuthenticated: true }),
}))

import { get } from '../lib/apiClient'
import { ProjectProvider, useProject } from './ProjectContext'

const BOARD_ID = '11111111-1111-4111-8111-111111111111'

function TestConsumer() {
  const { currentTasks, isTasksLoading, isTasksError, tasksError, setCurrentProjectId } = useProject()

  return (
    <div>
      <button onClick={() => setCurrentProjectId(BOARD_ID)}>load</button>
      {isTasksLoading && <span>loading</span>}
      {isTasksError && <span>error: {tasksError?.message}</span>}
      <ul>
        {currentTasks.map((t) => (
          <li key={t._id}>
            {t.title} - {t.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

function renderWithProviders() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <TestConsumer />
      </ProjectProvider>
    </QueryClientProvider>,
  )
}

describe('ProjectContext tasks query (apiClient integration)', () => {
  beforeEach(() => {
    get.mockReset()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('fetches tasks via apiClient using currentProjectId as boardId, mapped to the new Task shape', async () => {
    get.mockResolvedValue([
      { id: 't1', boardId: BOARD_ID, title: 'Weld frame', status: 'todo', position3d: { x: 1, y: 2, z: 3 } },
    ])

    renderWithProviders()
    screen.getByText('load').click()

    await waitFor(() => expect(screen.getByText('Weld frame - todo')).toBeInTheDocument())

    expect(get).toHaveBeenCalledWith('/tasks', { boardId: BOARD_ID })
  })

  it('surfaces an error state when apiClient rejects, for retry UI to key off', async () => {
    get.mockRejectedValue(new Error('Network request failed'))

    renderWithProviders()
    screen.getByText('load').click()

    // tasksQuery sets retry: 2 (overrides the test QueryClient's retry: false default,
    // since per-query options win), so this needs longer than waitFor's 1s default.
    await waitFor(() => expect(screen.getByText(/error: Network request failed/)).toBeInTheDocument(), {
      timeout: 5000,
    })
  })
})
