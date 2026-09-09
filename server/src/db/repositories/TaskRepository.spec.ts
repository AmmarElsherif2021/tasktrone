import { makeTask } from '../../../tests/factories/entities'
import { MockAdapter } from '../../../tests/mocks/MockAdapter'
import { TaskRepository } from './TaskRepository'

describe('TaskRepository', () => {
  it('create() inserts a task and returns the row', async () => {
    const adapter = new MockAdapter()
    const row = makeTask({ id: '1', boardId: 'b1', title: 'Weld frame', status: 'todo' })
    adapter.mockNextResult([row])
    const repo = new TaskRepository(adapter)

    const result = await repo.create({ boardId: 'b1', title: 'Weld frame' })

    expect(result).toEqual(row)
    expect(adapter.calls[0].sql).toContain('INSERT INTO tasks')
    expect(adapter.calls[0].params).toEqual(['b1', 'Weld frame', null, null, null])
  })

  it('create() serializes position3d as JSON', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([makeTask({ id: '1' })])
    const repo = new TaskRepository(adapter)

    await repo.create({ boardId: 'b1', title: 'Weld frame', position3d: { x: 1, y: 2, z: 3 } })

    expect(adapter.calls[0].params).toEqual(['b1', 'Weld frame', null, JSON.stringify({ x: 1, y: 2, z: 3 }), null])
  })

  it('findById() queries by id', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([makeTask({ id: '1' })])
    const repo = new TaskRepository(adapter)

    await repo.findById('1')

    expect(adapter.calls[0].sql).toContain('WHERE id = $1')
    expect(adapter.calls[0].params).toEqual(['1'])
  })

  it('findByBoard() queries by board id', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([])
    const repo = new TaskRepository(adapter)

    await repo.findByBoard('b1')

    expect(adapter.calls[0].sql).toContain('WHERE board_id = $1')
    expect(adapter.calls[0].params).toEqual(['b1'])
  })

  it('update() only sets the provided fields', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([makeTask({ id: '1', status: 'done' })])
    const repo = new TaskRepository(adapter)

    await repo.update('1', { status: 'done' })

    expect(adapter.calls[0].sql).toContain('status = $1')
    expect(adapter.calls[0].sql).not.toContain('title =')
    expect(adapter.calls[0].params).toEqual(['done', '1'])
  })

  it('update() with no changes just re-fetches the task (no adapter write)', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([makeTask({ id: '1' })])
    const repo = new TaskRepository(adapter)

    await repo.update('1', {})

    expect(adapter.calls[0].sql).toBe('SELECT * FROM tasks WHERE id = $1')
  })
})
