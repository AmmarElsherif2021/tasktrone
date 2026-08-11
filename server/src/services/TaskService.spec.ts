import { BoardRepository } from '../db/repositories/BoardRepository'
import { TaskRepository } from '../db/repositories/TaskRepository'
import { NotFoundError, ValidationError } from '../errors/domain-errors'
import { TaskService } from './TaskService'

function mockTaskRepo(): jest.Mocked<TaskRepository> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByBoard: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<TaskRepository>
}

function mockBoardRepo(): jest.Mocked<BoardRepository> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByOrganization: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<BoardRepository>
}

describe('TaskService', () => {
  it('createTask() rejects an empty title without touching the repo', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    const service = new TaskService(taskRepo, boardRepo)

    await expect(service.createTask({ boardId: 'b1', title: '  ' })).rejects.toThrow(ValidationError)
    expect(taskRepo.create).not.toHaveBeenCalled()
  })

  it('createTask() rejects when the board does not exist', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    boardRepo.findById.mockResolvedValue(null)
    const service = new TaskService(taskRepo, boardRepo)

    await expect(service.createTask({ boardId: 'missing', title: 'Weld frame' })).rejects.toThrow(NotFoundError)
    expect(taskRepo.create).not.toHaveBeenCalled()
  })

  it('createTask() creates the task once the board exists', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    boardRepo.findById.mockResolvedValue({ id: 'b1' } as never)
    taskRepo.create.mockResolvedValue({ id: 't1', title: 'Weld frame' } as never)
    const service = new TaskService(taskRepo, boardRepo)

    const task = await service.createTask({ boardId: 'b1', title: 'Weld frame' })

    expect(task).toEqual({ id: 't1', title: 'Weld frame' })
    expect(taskRepo.create).toHaveBeenCalledWith({
      boardId: 'b1',
      title: 'Weld frame',
      position3d: { x: 0, y: 0, z: 0 },
    })
  })

  it('createTask() defaults position3d to the origin when omitted', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    boardRepo.findById.mockResolvedValue({ id: 'b1' } as never)
    taskRepo.create.mockResolvedValue({ id: 't1' } as never)
    const service = new TaskService(taskRepo, boardRepo)

    await service.createTask({ boardId: 'b1', title: 'Weld frame' })

    expect(taskRepo.create).toHaveBeenCalledWith(expect.objectContaining({ position3d: { x: 0, y: 0, z: 0 } }))
  })

  it('createTask() passes an explicit position3d through unchanged', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    boardRepo.findById.mockResolvedValue({ id: 'b1' } as never)
    taskRepo.create.mockResolvedValue({ id: 't1' } as never)
    const service = new TaskService(taskRepo, boardRepo)

    await service.createTask({ boardId: 'b1', title: 'Weld frame', position3d: { x: 1, y: 2, z: 3 } })

    expect(taskRepo.create).toHaveBeenCalledWith(expect.objectContaining({ position3d: { x: 1, y: 2, z: 3 } }))
  })

  it('getTaskById() throws NotFoundError when missing', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    taskRepo.findById.mockResolvedValue(null)
    const service = new TaskService(taskRepo, boardRepo)

    await expect(service.getTaskById('missing')).rejects.toThrow(NotFoundError)
  })

  it('updateTask() allows a valid status transition', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    taskRepo.findById.mockResolvedValue({ id: 't1', status: 'todo' } as never)
    taskRepo.update.mockResolvedValue({ id: 't1', status: 'in_progress' } as never)
    const service = new TaskService(taskRepo, boardRepo)

    const updated = await service.updateTask('t1', { status: 'in_progress' })

    expect(updated.status).toBe('in_progress')
  })

  it('updateTask() rejects an invalid status transition', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    taskRepo.findById.mockResolvedValue({ id: 't1', status: 'todo' } as never)
    const service = new TaskService(taskRepo, boardRepo)

    await expect(service.updateTask('t1', { status: 'done' })).rejects.toThrow(ValidationError)
    expect(taskRepo.update).not.toHaveBeenCalled()
  })

  it('updateTask() throws NotFoundError when the task disappears mid-update', async () => {
    const taskRepo = mockTaskRepo()
    const boardRepo = mockBoardRepo()
    taskRepo.findById.mockResolvedValue({ id: 't1', status: 'todo' } as never)
    taskRepo.update.mockResolvedValue(null)
    const service = new TaskService(taskRepo, boardRepo)

    await expect(service.updateTask('t1', { title: 'New title' })).rejects.toThrow(NotFoundError)
  })
})
