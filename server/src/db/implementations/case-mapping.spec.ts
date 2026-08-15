import { toCamelCaseRow } from './case-mapping'

describe('toCamelCaseRow', () => {
  it('converts snake_case top-level keys to camelCase', () => {
    const row = {
      id: '1',
      board_id: 'b1',
      title: 'Weld frame',
      model_ref: null,
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    }

    expect(toCamelCaseRow(row)).toEqual({
      id: '1',
      boardId: 'b1',
      title: 'Weld frame',
      modelRef: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })
  })

  it('leaves already-camelCase and single-word keys untouched', () => {
    expect(toCamelCaseRow({ id: '1', title: 'x', status: 'todo' })).toEqual({
      id: '1',
      title: 'x',
      status: 'todo',
    })
  })

  it('does not recurse into JSONB object values (e.g. position3d)', () => {
    const row = { id: '1', position3d: { x: 1, y: 2, z: 3 } }

    expect(toCamelCaseRow(row)).toEqual({ id: '1', position3d: { x: 1, y: 2, z: 3 } })
  })

  it('handles multi-underscore column names', () => {
    expect(toCamelCaseRow({ organization_id: 'org1', display_name: 'A' })).toEqual({
      organizationId: 'org1',
      displayName: 'A',
    })
  })
})
