import { MockAdapter } from '../../../tests/mocks/MockAdapter'
import { BoardRepository } from './BoardRepository'

describe('BoardRepository', () => {
  it('create() inserts a board and returns the row', async () => {
    const adapter = new MockAdapter()
    const row = { id: '1', organizationId: 'org1', name: 'Assembly Line 1' }
    adapter.mockNextResult([row])
    const repo = new BoardRepository(adapter)

    const result = await repo.create({ organizationId: 'org1', name: 'Assembly Line 1' })

    expect(result).toEqual(row)
    expect(adapter.calls[0].sql).toContain('INSERT INTO boards')
    expect(adapter.calls[0].params).toEqual(['org1', 'Assembly Line 1'])
  })

  it('findByOrganization() queries by organization id', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([])
    const repo = new BoardRepository(adapter)

    await repo.findByOrganization('org1')

    expect(adapter.calls[0].sql).toContain('WHERE organization_id = $1')
    expect(adapter.calls[0].params).toEqual(['org1'])
  })

  it('update() with no name change re-fetches instead of writing', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([{ id: '1' }])
    const repo = new BoardRepository(adapter)

    await repo.update('1', {})

    expect(adapter.calls[0].sql).toBe('SELECT * FROM boards WHERE id = $1')
  })

  it('update() sets the new name', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([{ id: '1', name: 'Renamed' }])
    const repo = new BoardRepository(adapter)

    await repo.update('1', { name: 'Renamed' })

    expect(adapter.calls[0].sql).toContain('SET name = $1')
    expect(adapter.calls[0].params).toEqual(['Renamed', '1'])
  })
})
