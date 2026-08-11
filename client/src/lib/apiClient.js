/**
 * Minimal fetch wrapper for the Tasktrone NestJS backend (server/src/controllers).
 * Base URL comes from VITE_BACKEND_URL (see .env.example); requests are sent relative
 * to it, e.g. `get('/tasks', { boardId })` -> `${VITE_BACKEND_URL}/tasks?boardId=...`.
 *
 * Mocking in tests — mock the module, not global fetch:
 *
 *   vi.mock('../lib/apiClient', () => ({
 *     get: vi.fn(),
 *     post: vi.fn(),
 *     patch: vi.fn(),
 *   }))
 */

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? ''

export class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

function buildQuery(params) {
  if (!params) return ''
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  if (entries.length === 0) return ''
  return `?${new URLSearchParams(entries).toString()}`
}

async function request(method, path, { body, params } = {}) {
  const res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
    method,
    ...(body !== undefined && {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  })

  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : (data?.message ?? res.statusText)
    throw new ApiError(message, { status: res.status, body: data })
  }

  return data
}

export const get = (path, params) => request('GET', path, { params })
export const post = (path, body) => request('POST', path, { body })
export const patch = (path, body) => request('PATCH', path, { body })
