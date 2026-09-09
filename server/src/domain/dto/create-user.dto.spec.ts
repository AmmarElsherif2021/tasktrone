import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateUserDto } from './create-user.dto'
import { makeUser } from '../../../tests/factories/entities'

const { organizationId, email, displayName, role } = makeUser()

describe('CreateUserDto', () => {
  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateUserDto, {
      organizationId,
      email,
      displayName,
      role,
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('rejects an invalid email', async () => {
    const dto = plainToInstance(CreateUserDto, {
      organizationId,
      email: 'not-an-email',
      displayName,
      role,
    })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'email')).toBe(true)
  })

  it('rejects an invalid role', async () => {
    const dto = plainToInstance(CreateUserDto, {
      organizationId,
      email,
      displayName,
      role: 'superadmin',
    })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'role')).toBe(true)
  })
})
