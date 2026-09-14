import { bootstrap } from "../../src/bootstrap";
import { createSchema, dropSchema } from "./schema";

/**
 * Requires a running Postgres — `docker compose up -d` in server/ first.
 * Excluded from `npm test`; run explicitly with `npm run test:integration`.
 */
const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgres://tasktrone:tasktrone@localhost:5432/tasktrone";

describe("bootstrap (integration)", () => {
  it("wires services that can create and read through a real Postgres", async () => {
    const { taskService, boardService, adapter } = bootstrap(DATABASE_URL);

    try {
      await createSchema(adapter);

      const board = await boardService.createBoard({
        organizationId: "11111111-1111-4111-8111-111111111111",
        name: "Bootstrap Smoke Board",
      });
      const task = await taskService.createTask({
        boardId: board.id,
        title: "Bootstrap Smoke Task",
      });

      expect(task.boardId).toBe(board.id);
      expect(task.position3d).toEqual({ x: 0, y: 0, z: 0 });
      expect(await taskService.getTaskById(task.id)).toEqual(task);
    } finally {
      await dropSchema(adapter);
      //await adapter.close()
    }
  });
});
