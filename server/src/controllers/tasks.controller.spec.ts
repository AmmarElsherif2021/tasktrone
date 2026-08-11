import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DomainErrorFilter } from '../errors/domain-error.filter'
import { NotFoundError, ValidationError } from '../errors/domain-errors'
import { TaskService } from '../services/TaskService'
import { TasksController } from './tasks.controller'

describe('TasksController', () => {
  let app: INestApplication
  const taskService = {
    createTask: jest.fn(),
    getTasksByBoard: jest.fn(),
    updateTask: jest.fn(),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TaskService, useValue: taskService }],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
    app.useGlobalFilters(new DomainErrorFilter())
    await app.init()
  })

  afterEach(() => jest.clearAllMocks())
  afterAll(() => app.close())

  it('POST /tasks validates the payload (including nested position3d) and delegates to TaskService', async () => {
    taskService.createTask.mockResolvedValue({ id: 't1', title: 'Weld frame' })

    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        boardId: '11111111-1111-4111-8111-111111111111',
        title: 'Weld frame',
        position3d: { x: 1, y: 2, z: 3 },
      })
      .expect(201)

    expect(res.body).toEqual({ id: 't1', title: 'Weld frame' })
    expect(taskService.createTask).toHaveBeenCalledWith({
      boardId: '11111111-1111-4111-8111-111111111111',
      title: 'Weld frame',
      position3d: { x: 1, y: 2, z: 3 },
    })
  })

  it('POST /tasks rejects a missing boardId with 400', async () => {
    const res = await request(app.getHttpServer()).post('/tasks').send({ title: 'No board' }).expect(400)

    expect(res.body.statusCode).toBe(400)
    expect(taskService.createTask).not.toHaveBeenCalled()
  })

  it('POST /tasks rejects an invalid position3d with 400', async () => {
    await request(app.getHttpServer())
      .post('/tasks')
      .send({
        boardId: '11111111-1111-4111-8111-111111111111',
        title: 'Weld frame',
        position3d: { x: 'a', y: 2, z: 3 },
      })
      .expect(400)

    expect(taskService.createTask).not.toHaveBeenCalled()
  })

  it('GET /tasks?boardId= delegates to TaskService', async () => {
    taskService.getTasksByBoard.mockResolvedValue([{ id: 't1' }])

    const res = await request(app.getHttpServer())
      .get('/tasks')
      .query({ boardId: '11111111-1111-4111-8111-111111111111' })
      .expect(200)

    expect(res.body).toEqual([{ id: 't1' }])
    expect(taskService.getTasksByBoard).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111')
  })

  it('GET /tasks without boardId is rejected with 400', async () => {
    await request(app.getHttpServer()).get('/tasks').expect(400)
    expect(taskService.getTasksByBoard).not.toHaveBeenCalled()
  })

  it('PATCH /tasks/:id delegates to TaskService', async () => {
    taskService.updateTask.mockResolvedValue({ id: 't1', status: 'in_progress' })

    const res = await request(app.getHttpServer()).patch('/tasks/t1').send({ status: 'in_progress' }).expect(200)

    expect(res.body).toEqual({ id: 't1', status: 'in_progress' })
    expect(taskService.updateTask).toHaveBeenCalledWith('t1', { status: 'in_progress' })
  })

  it('PATCH /tasks/:id returns 400 when TaskService rejects an invalid status transition', async () => {
    taskService.updateTask.mockRejectedValue(new ValidationError('Cannot move task from done to todo'))

    const res = await request(app.getHttpServer()).patch('/tasks/t1').send({ status: 'todo' }).expect(400)

    expect(res.body).toEqual({ statusCode: 400, error: 'Bad Request', message: 'Cannot move task from done to todo' })
  })

  it('GET /tasks?boardId= maps a NotFoundError thrown by TaskService to 404', async () => {
    taskService.getTasksByBoard.mockRejectedValue(new NotFoundError('Board missing not found'))

    const res = await request(app.getHttpServer())
      .get('/tasks')
      .query({ boardId: '11111111-1111-4111-8111-111111111111' })
      .expect(404)

    expect(res.body).toEqual({ statusCode: 404, error: 'Not Found', message: 'Board missing not found' })
  })
})
