import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { CreateTaskDto } from './create-task.dto'

const VALID_BOARD_ID = '11111111-1111-4111-8111-111111111111'

describe('CreateTaskDto', () => {
  it('accepts a valid payload with position3d', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      boardId: VALID_BOARD_ID,
      title: 'Weld frame',
      position3d: { x: 1, y: 2, z: 3 },
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('accepts a valid payload without position3d', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      boardId: VALID_BOARD_ID,
      title: 'Weld frame',
    })

    const errors = await validate(dto)

    expect(errors).toHaveLength(0)
  })

  it('rejects a payload missing the required title', async () => {
    const dto = plainToInstance(CreateTaskDto, { boardId: VALID_BOARD_ID })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'title')).toBe(true)
  })

  it('rejects a non-UUID boardId', async () => {
    const dto = plainToInstance(CreateTaskDto, { boardId: 'not-a-uuid', title: 'Weld frame' })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'boardId')).toBe(true)
  })

  it('rejects an invalid position3d', async () => {
    const dto = plainToInstance(CreateTaskDto, {
      boardId: VALID_BOARD_ID,
      title: 'Weld frame',
      position3d: { x: 'a', y: 2, z: 3 },
    })

    const errors = await validate(dto)

    expect(errors.some((e) => e.property === 'position3d')).toBe(true)
  })
})
