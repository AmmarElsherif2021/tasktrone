import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DomainErrorFilter } from '../errors/domain-error.filter'
import { NotFoundError } from '../errors/domain-errors'
import { BoardService } from '../services/BoardService'
import { BoardsController } from './boards.controller'

describe('BoardsController', () => {
  let app: INestApplication
  const boardService = {
    createBoard: jest.fn(),
    getBoardById: jest.fn(),
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [{ provide: BoardService, useValue: boardService }],
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
    app.useGlobalFilters(new DomainErrorFilter())
    await app.init()
  })

  afterEach(() => jest.clearAllMocks())
  afterAll(() => app.close())

  it('POST /boards validates the payload and delegates to BoardService', async () => {
    boardService.createBoard.mockResolvedValue({ id: 'b1', name: 'Assembly Line 1' })

    const res = await request(app.getHttpServer())
      .post('/boards')
      .send({ organizationId: '11111111-1111-4111-8111-111111111111', name: 'Assembly Line 1' })
      .expect(201)

    expect(res.body).toEqual({ id: 'b1', name: 'Assembly Line 1' })
    expect(boardService.createBoard).toHaveBeenCalledWith({
      organizationId: '11111111-1111-4111-8111-111111111111',
      name: 'Assembly Line 1',
    })
  })

  it('POST /boards rejects a payload missing organizationId with 400', async () => {
    const res = await request(app.getHttpServer()).post('/boards').send({ name: 'No org id' }).expect(400)

    expect(res.body.statusCode).toBe(400)
    expect(boardService.createBoard).not.toHaveBeenCalled()
  })

  it('POST /boards rejects unknown fields with 400 (whitelist)', async () => {
    await request(app.getHttpServer())
      .post('/boards')
      .send({ organizationId: '11111111-1111-4111-8111-111111111111', name: 'X', extra: 'nope' })
      .expect(400)
  })

  it('GET /boards/:id delegates to BoardService', async () => {
    boardService.getBoardById.mockResolvedValue({ id: 'b1', name: 'Assembly Line 1' })

    const res = await request(app.getHttpServer()).get('/boards/b1').expect(200)

    expect(res.body).toEqual({ id: 'b1', name: 'Assembly Line 1' })
    expect(boardService.getBoardById).toHaveBeenCalledWith('b1')
  })

  it('GET /boards/:id returns 404 when the board does not exist', async () => {
    boardService.getBoardById.mockRejectedValue(new NotFoundError('Board missing not found'))

    const res = await request(app.getHttpServer()).get('/boards/missing').expect(404)

    expect(res.body).toEqual({ statusCode: 404, error: 'Not Found', message: 'Board missing not found' })
  })
})
