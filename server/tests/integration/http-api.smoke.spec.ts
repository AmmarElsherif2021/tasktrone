import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { PostgresAdapter } from '../../src/db/implementations/PostgresAdapter'
import { DomainErrorFilter } from '../../src/errors/domain-error.filter'
import { createSchema, dropSchema } from './schema'

/**
 * Requires a running Postgres — `docker compose up -d` in server/ first.
 * Excluded from `npm test`; run explicitly with `npm run test:integration`.
 */
const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://tasktrone:tasktrone@localhost:5432/tasktrone'

describe('HTTP API (integration)', () => {
  let app: INestApplication
  let adapter: PostgresAdapter

  beforeAll(async () => {
    process.env.DATABASE_URL = DATABASE_URL

    adapter = new PostgresAdapter(DATABASE_URL)
    await createSchema(adapter)

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
    app.useGlobalFilters(new DomainErrorFilter())
    await app.init()
  })

  afterAll(async () => {
    await dropSchema(adapter)
    await adapter.close()
    await app.close()
  })

  it('create board -> create task -> fetch tasks by board -> patch task', async () => {
    const boardRes = await request(app.getHttpServer())
      .post('/boards')
      .send({ organizationId: '11111111-1111-4111-8111-111111111111', name: 'Assembly Line 1' })
      .expect(201)

    const boardId = boardRes.body.id
    expect(boardId).toBeDefined()

    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ boardId, title: 'Weld frame', position3d: { x: 1, y: 2, z: 3 } })
      .expect(201)

    expect(taskRes.body.title).toBe('Weld frame')
    expect(taskRes.body.position3d).toEqual({ x: 1, y: 2, z: 3 })

    const listRes = await request(app.getHttpServer()).get('/tasks').query({ boardId }).expect(200)

    expect(listRes.body).toHaveLength(1)
    expect(listRes.body[0].position3d).toEqual({ x: 1, y: 2, z: 3 })

    const patchRes = await request(app.getHttpServer())
      .patch(`/tasks/${taskRes.body.id}`)
      .send({ status: 'in_progress' })
      .expect(200)

    expect(patchRes.body.status).toBe('in_progress')
  })

  it('defaults position3d to the origin when a task is created without one', async () => {
    const boardRes = await request(app.getHttpServer())
      .post('/boards')
      .send({ organizationId: '11111111-1111-4111-8111-111111111111', name: 'Assembly Line 2' })
      .expect(201)

    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .send({ boardId: boardRes.body.id, title: 'Untitled placement' })
      .expect(201)

    expect(taskRes.body.position3d).toEqual({ x: 0, y: 0, z: 0 })

    const listRes = await request(app.getHttpServer())
      .get('/tasks')
      .query({ boardId: boardRes.body.id })
      .expect(200)

    expect(listRes.body[0].position3d).toEqual({ x: 0, y: 0, z: 0 })
  })

  it('rejects an invalid create-task payload with a 400 and a validation-error shape', async () => {
    const res = await request(app.getHttpServer()).post('/tasks').send({ title: 'Missing boardId' }).expect(400)

    expect(res.body).toMatchObject({ statusCode: 400, error: 'Bad Request' })
    expect(Array.isArray(res.body.message)).toBe(true)
  })

  it('returns 404 with the domain-error shape for a board that does not exist', async () => {
    const res = await request(app.getHttpServer())
      .get('/boards/00000000-0000-4000-8000-000000000000')
      .expect(404)

    expect(res.body.statusCode).toBe(404)
    expect(res.body.error).toBe('Not Found')
  })
})
