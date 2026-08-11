import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, get, patch, post } from './apiClient'

// apiClient reads VITE_BACKEND_URL and prefixes every request with it, so tests
// build expected URLs from the same env var rather than assuming it's unset.
const BASE = import.meta.env.VITE_BACKEND_URL ?? ''

describe('apiClient', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('get() sends a GET request and returns parsed JSON', async () => {
    fetch.mockResolvedValue(new Response(JSON.stringify([{ id: '1' }]), { status: 200 }))

    const result = await get('/tasks')

    expect(result).toEqual([{ id: '1' }])
    expect(fetch).toHaveBeenCalledWith(`${BASE}/tasks`, { method: 'GET' })
  })

  it('get() appends query params, skipping undefined/null', async () => {
    fetch.mockResolvedValue(new Response('[]', { status: 200 }))

    await get('/tasks', { boardId: 'b1', unused: undefined, dropped: null })

    expect(fetch).toHaveBeenCalledWith(`${BASE}/tasks?boardId=b1`, { method: 'GET' })
  })

  it('post() sends a JSON body with the right headers', async () => {
    fetch.mockResolvedValue(new Response(JSON.stringify({ id: 't1' }), { status: 201 }))

    const result = await post('/tasks', { title: 'Weld frame' })

    expect(result).toEqual({ id: 't1' })
    expect(fetch).toHaveBeenCalledWith(`${BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Weld frame' }),
    })
  })

  it('patch() sends a JSON body with PATCH', async () => {
    fetch.mockResolvedValue(new Response(JSON.stringify({ id: 't1', status: 'in_progress' }), { status: 200 }))

    const result = await patch('/tasks/t1', { status: 'in_progress' })

    expect(result).toEqual({ id: 't1', status: 'in_progress' })
    expect(fetch).toHaveBeenCalledWith(`${BASE}/tasks/t1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in_progress' }),
    })
  })

  it('handles a 204/empty response body', async () => {
    fetch.mockResolvedValue(new Response('', { status: 200 }))

    const result = await get('/health')

    expect(result).toBeNull()
  })

  it('throws an ApiError with status and body on a non-ok response', async () => {
    fetch.mockResolvedValue(
      new Response(
        JSON.stringify({ statusCode: 400, error: 'Bad Request', message: ['title should not be empty'] }),
        { status: 400 },
      ),
    )

    const error = await post('/tasks', {}).catch((e) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(400)
    expect(error.message).toBe('title should not be empty')
    expect(error.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: ['title should not be empty'],
    })
  })
})
