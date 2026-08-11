import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

describe('CreateUserDto', () => {
  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateUserDto, {
      organizationId: '11111111-1111-4111-8111-111111111111',
      email: 'inspector@example.com',
      displayName: 'QC Inspector',
      role: 'member',
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('rejects an invalid email', async () => {
    const dto = plainToInstance(CreateUserDto, {
      organizationId: '11111111-1111-4111-8111-111111111111',
      email: 'not-an-email',
      displayName: 'QC Inspector',
      role: 'member',
    })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'email')).toBe(true)
  })

  it('rejects an invalid role', async () => {
    const dto = plainToInstance(CreateUserDto, {
      organizationId: '11111111-1111-4111-8111-111111111111',
      email: 'inspector@example.com',
      displayName: 'QC Inspector',
      role: 'superadmin',
    })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'role')).toBe(true)
  })
})
