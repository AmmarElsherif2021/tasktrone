import Ajv from 'ajv'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import boardSchema from '../../../contracts/board.schema.json'
import taskSchema from '../../../contracts/task.schema.json'
import { get, post } from './apiClient'

/**
 * Validates that what apiClient hands back to its callers (ProjectContext, CreateTask)
 * matches contracts/*.schema.json — the same schemas
 * server/tests/integration/contract.spec.ts checks real HTTP responses against. If the
 * server's actual shape drifts, that test fails; if a fixture here silently drifts from
 * the schema instead, this one catches that side.
 */
const ajv = new Ajv()
const validateTask = ajv.compile(taskSchema)
const validateBoard = ajv.compile(boardSchema)

function expectValid(validate, data) {
  const valid = validate(data)
  expect(valid ? null : ajv.errorsText(validate.errors)).toBeNull()
}

describe('apiClient responses match contracts/*.schema.json', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('a realistic /tasks response matches task.schema.json', async () => {
    const taskFixture = {
      id: 't1',
      boardId: 'b1',
      title: 'Weld frame',
      description: 'Weld the main frame',
      status: 'todo',
      position3d: { x: 1, y: 2, z: 3 },
      modelRef: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    fetch.mockResolvedValue(new Response(JSON.stringify([taskFixture]), { status: 200 }))

    const tasks = await get('/tasks', { boardId: 'b1' })

    expect(tasks).toHaveLength(1)
    expectValid(validateTask, tasks[0])

    // Pin down the specific fields ProjectContext.jsx's tasksQuery `select` reads off
    // each task, so a rename there is caught here too, not just at the schema level.
    expect(tasks[0]).toMatchObject({
      boardId: expect.any(String),
      status: expect.any(String),
      position3d: { x: expect.any(Number), y: expect.any(Number), z: expect.any(Number) },
      createdAt: expect.any(String),
    })
  })

  it('a /tasks response with a null position3d/description/modelRef still matches the schema', async () => {
    const taskFixture = {
      id: 't1',
      boardId: 'b1',
      title: 'Untitled placement',
      description: null,
      status: 'todo',
      position3d: null,
      modelRef: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    fetch.mockResolvedValue(new Response(JSON.stringify(taskFixture), { status: 201 }))

    const task = await post('/tasks', { boardId: 'b1', title: 'Untitled placement' })

    expectValid(validateTask, task)
  })

  it('a realistic /boards response matches board.schema.json', async () => {
    const boardFixture = {
      id: 'b1',
      organizationId: 'org1',
      name: 'Assembly Line 1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }
    fetch.mockResolvedValue(new Response(JSON.stringify(boardFixture), { status: 201 }))

    const board = await post('/boards', { organizationId: 'org1', name: 'Assembly Line 1' })

    expectValid(validateBoard, board)
    // Pin down the field CreateTask.jsx reads off the created board.
    expect(board).toMatchObject({ id: expect.any(String) })
  })
})
