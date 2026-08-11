import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { UpdateTaskDto } from './update-task.dto'

describe('UpdateTaskDto', () => {
  it('accepts a partial update with a valid status', async () => {
    const dto = plainToInstance(UpdateTaskDto, { status: 'in_progress' })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('accepts an empty payload (all fields optional)', async () => {
    const dto = plainToInstance(UpdateTaskDto, {})

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('rejects an invalid status', async () => {
    const dto = plainToInstance(UpdateTaskDto, { status: 'archived' })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'status')).toBe(true)
  })

  it('rejects an invalid position3d', async () => {
    const dto = plainToInstance(UpdateTaskDto, { position3d: { x: 1, y: 2 } })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'position3d')).toBe(true)
  })
})
