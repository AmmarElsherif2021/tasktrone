import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateTaskDto } from './create-task.dto'
import { makeTask } from '../../../tests/factories/entities'

const { boardId, title, description, position3d, modelRef } = makeTask()

describe('CreateTaskDto', () => {
  it('accepts a valid payload with position3d', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      boardId,
      title,
      position3d,
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('accepts a valid payload without position3d', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      boardId,
      title,
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('rejects a payload missing the required title', async () => {
    const dto = plainToInstance(CreateTaskDto, { boardId })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'title')).toBe(true)
  })

  it('rejects a non-UUID boardId', async () => {
    const dto = plainToInstance(CreateTaskDto, { boardId: 'not-a-uuid', title })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'boardId')).toBe(true)
  })

  it('rejects an invalid position3d', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      boardId,
      title,
      description,
      modelRef,
      position3d: { x: 'a', y: 2, z: 3 },
    })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'position3d')).toBe(true)
  })
})
