<<<<<<< HEAD
import { DBAdapter } from '../../../src/db/adapter'
import { BoardRepository } from '../../../src/db/repositories/BoardRepository'
import { Board } from '../../../src/domain/board.entity'
import { makeBoard } from '../../factories/entities'
=======
import { DBAdapter } from "../../../src/db/adapter";
import { BoardRepository } from "../../../src/db/repositories/BoardRepository";
import { Board } from "../../../src/domain/board.entity";
import { makeBoard } from "../../factories/entities";
>>>>>>> e1a6194 (new file:   .github/ISSUE_TEMPLATE/task.yml)

/**
 * Inserts a real board row against the DB behind `db` (via BoardRepository,
 * not raw SQL), defaulting its fields from `makeBoard()` so integration
 * fixtures stay in sync with the unit-tier entity factory they mirror.
 * Pass overrides to vary specific fields for a given test.
 */
export async function seedBoard(
  db: DBAdapter,
<<<<<<< HEAD
  overrides: Partial<Pick<Board, 'organizationId' | 'name'>> = {},
): Promise<Board> {
  const defaults = makeBoard()
  return new BoardRepository(db).create({
    organizationId: overrides.organizationId ?? defaults.organizationId,
    name: overrides.name ?? defaults.name,
  })
=======
  overrides: Partial<Pick<Board, "organizationId" | "name">> = {},
): Promise<Board> {
  const defaults = makeBoard();
  return new BoardRepository(db).create({
    organizationId: overrides.organizationId ?? defaults.organizationId,
    name: overrides.name ?? defaults.name,
  });
>>>>>>> e1a6194 (new file:   .github/ISSUE_TEMPLATE/task.yml)
}
