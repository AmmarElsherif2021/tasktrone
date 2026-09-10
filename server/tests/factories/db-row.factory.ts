import { randomUUID } from "crypto";
import { toSnakeCaseRow } from "src/db/implementations/case-mapping";
import { makeTask, makeBoard, makeUser } from "./entities/index";
import { Task, Board, User } from "src/domain/index";
/**
 * Builds raw Postgres row shapes — snake_case columns, as `pg` returns them
 * before `toCamelCaseRow` (server/src/db/implementations/case-mapping.ts)
 * converts them to the camelCase domain entities. Use these wherever a test
 * needs to stand in for what the driver hands back pre-mapping (e.g.
 * PostgresAdapter unit specs mocking `pg.Pool#query`); use the entity
 * factories under tests/factories/entities for anything already mapped.
 *
 *   makeTaskRow({ status: 'done' })
 */
export function makeTaskRow(
  overrides: Partial<Task> = {},
): Partial<Task> & Record<string, unknown> {
  return toSnakeCaseRow(
    makeTask(overrides as Partial<Task>) as unknown as Record<string, unknown>,
  );
}

export function makeBoardRow(
  overrides: Partial<Board> = {},
): Record<string, unknown> {
  return toSnakeCaseRow(
    makeBoard(overrides as Partial<Board>) as unknown as Record<
      string,
      unknown
    >,
  );
}

export function makeUserRow(
  overrides: Partial<User> = {},
): Record<string, unknown> {
  return toSnakeCaseRow(
    makeUser(overrides as Partial<User>) as unknown as Record<string, unknown>,
  );
}
