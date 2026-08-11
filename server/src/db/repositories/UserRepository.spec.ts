import { MockAdapter } from '../../../tests/mocks/MockAdapter'
import { UserRepository } from './UserRepository'

describe('UserRepository', () => {
  it('create() inserts a user and returns the row', async () => {
    const adapter = new MockAdapter()
    const row = { id: '1', organizationId: 'org1', email: 'a@b.com', displayName: 'A', role: 'member' }
    adapter.mockNextResult([row])
    const repo = new UserRepository(adapter)

    const result = await repo.create({ organizationId: 'org1', email: 'a@b.com', displayName: 'A', role: 'member' })

    expect(result).toEqual(row)
    expect(adapter.calls[0].sql).toContain('INSERT INTO users')
    expect(adapter.calls[0].params).toEqual(['org1', 'a@b.com', 'A', 'member'])
  })

  it('findByOrganization() queries by organization id', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([])
    const repo = new UserRepository(adapter)

    await repo.findByOrganization('org1')

    expect(adapter.calls[0].sql).toContain('WHERE organization_id = $1')
    expect(adapter.calls[0].params).toEqual(['org1'])
  })

  it('update() only sets the provided fields', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([{ id: '1', role: 'admin' }])
    const repo = new UserRepository(adapter)

    await repo.update('1', { role: 'admin' })

    expect(adapter.calls[0].sql).toContain('role = $1')
    expect(adapter.calls[0].sql).not.toContain('display_name =')
    expect(adapter.calls[0].params).toEqual(['admin', '1'])
  })

  it('update() with no changes re-fetches instead of writing', async () => {
    const adapter = new MockAdapter()
    adapter.mockNextResult([{ id: '1' }])
    const repo = new UserRepository(adapter)

    await repo.update('1', {})

    expect(adapter.calls[0].sql).toBe('SELECT * FROM users WHERE id = $1')
  })
})
