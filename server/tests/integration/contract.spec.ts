import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import Ajv from 'ajv'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { PostgresAdapter } from '../../src/db/implementations/PostgresAdapter'
import boardSchema from '../../../contracts/board.schema.json'
import taskSchema from '../../../contracts/task.schema.json'
import { createSchema, dropSchema } from './schema'

/**
 * Validates real HTTP responses against contracts/*.schema.json — the same schemas
 * client/src/lib/apiClient.contract.test.js checks apiClient's callers against. If this
 * fails, the server's actual response shape has drifted from what the client expects.
 *
 * Requires a running Postgres — `docker compose up -d` in server/ first.
 * Excluded from `npm test`; run explicitly with `npm run test:integration`.
 */
const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://tasktrone:tasktrone@localhost:5432/tasktrone'

const ajv = new Ajv()
const validateBoard = ajv.compile(boardSchema)
const validateTask = ajv.compile(taskSchema)

/** expect(valid).toBe(true) alone loses ajv's error detail on failure; this surfaces it
 * as the "received" value instead, without expect() needing a Chai-style message arg. */
function expectValid(valid: boolean, errors: typeof validateBoard.errors) {
  expect(valid ? null : ajv.errorsText(errors)).toBeNull()
}

describe('Contract: server responses match contracts/*.schema.json', () => {
  let app: INestApplication
  let adapter: PostgresAdapter

  beforeAll(async () => {
    process.env.DATABASE_URL = DATABASE_URL

    adapter = new PostgresAdapter(DATABASE_URL)
    await createSchema(adapter)

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
    await app.init()
  })

  afterAll(async () => {
    await dropSchema(adapter)
    await adapter.close()
    await app.close()
  })

  it('POST /boards response matches board.schema.json', async () => {
    const res = await request(app.getHttpServer())
      .post('/boards')
      .send({ organizationId: '11111111-1111-4111-8111-111111111111', name: 'Assembly Line 1' })
      .expect(201)

    const valid = validateBoard(res.body)
    expectValid(valid, validateBoard.errors)
  })

  it('POST /tasks response matches task.schema.json, including a real (non-null) position3d', async () => {
    const boardRes = await request(app.getHttpServer())
      .post('/boards')
      .send({ organizationId: '11111111-1111-4111-8111-111111111111', name: 'Assembly Line 2' })
      .expect(201)

    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ boardId: boardRes.body.id, title: 'Weld frame', position3d: { x: 1, y: 2, z: 3 } })
      .expect(201)

    const valid = validateTask(res.body)
    expectValid(valid, validateTask.errors)
    // Schema alone allows position3d: null — pin down that a supplied value round-trips as an object.
    expect(res.body.position3d).toEqual({ x: 1, y: 2, z: 3 })
  })

  it('GET /tasks response items each match task.schema.json', async () => {
    const boardRes = await request(app.getHttpServer())
      .post('/boards')
      .send({ organizationId: '11111111-1111-4111-8111-111111111111', name: 'Assembly Line 3' })
      .expect(201)

    await request(app.getHttpServer())
      .post('/tasks')
      .send({ boardId: boardRes.body.id, title: 'Untitled placement' })
      .expect(201)

    const listRes = await request(app.getHttpServer()).get('/tasks').query({ boardId: boardRes.body.id }).expect(200)

    expect(listRes.body.length).toBeGreaterThan(0)
    for (const task of listRes.body) {
      const valid = validateTask(task)
      expectValid(valid, validateTask.errors)
    }
  })
})
