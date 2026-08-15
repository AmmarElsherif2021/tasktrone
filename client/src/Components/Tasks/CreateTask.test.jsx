/** @vitest-environment jsdom */
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { mockRefreshTasks } = vi.hoisted(() => ({ mockRefreshTasks: vi.fn() }))

vi.mock('../../lib/apiClient', () => ({ post: vi.fn() }))
vi.mock('../../contexts/ProjectContext', () => ({
  useProject: () => ({
    currentProjectMembers: [],
    currentProjectId: '11111111-1111-4111-8111-111111111111',
    currentPhase: null,
    refreshTasks: mockRefreshTasks,
    boards: [],
  }),
}))

import { post } from '../../lib/apiClient'
import { CreateTask } from './CreateTask'

function renderWithProviders() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <CreateTask />
    </QueryClientProvider>,
  )
}

describe('CreateTask (apiClient integration)', () => {
  beforeEach(() => {
    post.mockReset()
    mockRefreshTasks.mockReset()
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('submits only title/description to POST /tasks, using currentProjectId as boardId', async () => {
    post.mockResolvedValue({ id: 't1', boardId: '11111111-1111-4111-8111-111111111111', title: 'Weld frame' })
    const user = userEvent.setup()

    renderWithProviders()
    await user.click(screen.getByRole('button', { name: /create task/i }))

    await user.type(screen.getByPlaceholderText('Enter task title'), 'Weld frame')
    await user.type(screen.getByPlaceholderText('Describe the task'), 'Weld the main frame')
    await user.click(screen.getByRole('button', { name: /^create task$/i }))

    await waitFor(() => expect(post).toHaveBeenCalledTimes(1))
    expect(post).toHaveBeenCalledWith('/tasks', {
      boardId: '11111111-1111-4111-8111-111111111111',
      title: 'Weld frame',
      description: 'Weld the main frame',
    })
  })

  it('refreshes tasks and closes the modal on success', async () => {
    post.mockResolvedValue({ id: 't1' })
    const user = userEvent.setup()

    renderWithProviders()
    await user.click(screen.getByRole('button', { name: /create task/i }))
    await user.type(screen.getByPlaceholderText('Enter task title'), 'Weld frame')
    await user.click(screen.getByRole('button', { name: /^create task$/i }))

    await waitFor(() => expect(mockRefreshTasks).toHaveBeenCalled())
    await waitFor(() => expect(screen.queryByPlaceholderText('Enter task title')).not.toBeInTheDocument())
  })

  it('shows the backend validation error message on a 4xx response', async () => {
    post.mockRejectedValue(Object.assign(new Error('Title is required'), { name: 'ApiError', status: 400 }))
    const user = userEvent.setup()

    renderWithProviders()
    await user.click(screen.getByRole('button', { name: /create task/i }))
    await user.type(screen.getByPlaceholderText('Enter task title'), 'x')
    await user.click(screen.getByRole('button', { name: /^create task$/i }))

    await waitFor(() => expect(screen.getByText('Title is required')).toBeInTheDocument())
  })
})
