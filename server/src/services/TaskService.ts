import { BoardRepository } from '../db/repositories/BoardRepository'
import { CreateTaskInput, TaskRepository, UpdateTaskInput } from '../db/repositories/TaskRepository'
import { Task, TaskStatus } from '../domain/task.entity'
import { NotFoundError, ValidationError } from '../errors/domain-errors'

const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  todo: ['in_progress'],
  in_progress: ['review', 'todo'],
  review: ['done', 'in_progress'],
  done: [],
}

export class TaskService {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly boardRepo: BoardRepository,
  ) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    if (!input.title?.trim()) {
      throw new ValidationError('Title is required')
    }

    const board = await this.boardRepo.findById(input.boardId)
    if (!board) {
      throw new NotFoundError(`Board ${input.boardId} not found`)
    }

    return this.taskRepo.create({
      ...input,
      position3d: input.position3d ?? { x: 0, y: 0, z: 0 },
    })
  }

  async getTasksByBoard(boardId: string): Promise<Task[]> {
    return this.taskRepo.findByBoard(boardId)
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepo.findById(id)
    if (!task) {
      throw new NotFoundError(`Task ${id} not found`)
    }
    return task
  }

  async updateTask(id: string, changes: UpdateTaskInput): Promise<Task> {
    const existing = await this.getTaskById(id)

    if (changes.status && !VALID_TRANSITIONS[existing.status].includes(changes.status)) {
      throw new ValidationError(`Cannot move task from ${existing.status} to ${changes.status}`)
    }

    const updated = await this.taskRepo.update(id, changes)
    if (!updated) {
      throw new NotFoundError(`Task ${id} not found`)
    }
    return updated
  }
}
