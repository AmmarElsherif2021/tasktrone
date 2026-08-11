import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateBoardDto } from './create-board.dto'

describe('CreateBoardDto', () => {
  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateBoardDto, {
      organizationId: '11111111-1111-4111-8111-111111111111',
      name: 'Assembly Line 1',
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('rejects a non-UUID organizationId', async () => {
    const dto = plainToInstance(CreateBoardDto, { organizationId: 'not-a-uuid', name: 'Assembly Line 1' })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'organizationId')).toBe(true)
  })

  it('rejects a missing name', async () => {
    const dto = plainToInstance(CreateBoardDto, { organizationId: '11111111-1111-4111-8111-111111111111' })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'name')).toBe(true)
  })
})
