import { ArgumentsHost, Controller, Get, INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DomainErrorFilter } from './domain-error.filter'
import { NotFoundError, ValidationError } from './domain-errors'

function mockHost() {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost
  return { host, response }
}

describe('DomainErrorFilter (unit)', () => {
  it('maps NotFoundError to 404', () => {
    const filter = new DomainErrorFilter()
    const { host, response } = mockHost()

    filter.catch(new NotFoundError('Board x not found'), host)

    expect(response.status).toHaveBeenCalledWith(404)
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 404,
      error: 'Not Found',
      message: 'Board x not found',
    })
  })

  it('maps ValidationError to 400', () => {
    const filter = new DomainErrorFilter()
    const { host, response } = mockHost()

    filter.catch(new ValidationError('Title is required'), host)

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.json).toHaveBeenCalledWith({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Title is required',
    })
  })
})

@Controller('__test-errors')
class ThrowingController {
  @Get('not-found')
  notFound(): never {
    throw new NotFoundError('Widget not found')
  }

  @Get('validation')
  validation(): never {
    throw new ValidationError('Bad input')
  }

  @Get('generic')
  generic(): never {
    throw new Error('boom')
  }
}

describe('DomainErrorFilter (wired into a Nest app)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ controllers: [ThrowingController] }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalFilters(new DomainErrorFilter())
    await app.init()
  })

  afterAll(() => app.close())

  it('NotFoundError thrown by a route handler -> 404', async () => {
    const res = await request(app.getHttpServer()).get('/__test-errors/not-found').expect(404)
    expect(res.body).toEqual({ statusCode: 404, error: 'Not Found', message: 'Widget not found' })
  })

  it('ValidationError thrown by a route handler -> 400', async () => {
    const res = await request(app.getHttpServer()).get('/__test-errors/validation').expect(400)
    expect(res.body).toEqual({ statusCode: 400, error: 'Bad Request', message: 'Bad input' })
  })

  it("a generic Error falls through to Nest's default filter -> 500", async () => {
    const res = await request(app.getHttpServer()).get('/__test-errors/generic').expect(500)
    expect(res.body.statusCode).toBe(500)
  })
})
