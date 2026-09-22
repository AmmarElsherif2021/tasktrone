import {
  BoardRepository,
  CreateBoardInput,
} from "../db/repositories/BoardRepository";
import { Board } from "../domain/board.entity";
import { NotFoundError, ValidationError } from "../errors/domain-errors";

export class BoardService {
  constructor(private readonly boardRepo: BoardRepository) {}

  async createBoard(input: CreateBoardInput): Promise<Board> {
    if (!input.name?.trim()) {
      throw new ValidationError("Name is required");
    }
    return this.boardRepo.create(input);
  }

  async getBoardById(id: string): Promise<Board> {
    const board = await this.boardRepo.findById(id);
    if (!board) {
      throw new NotFoundError(`Board ${id} not found`);
    }
    return board;
  }

  async getBoardsByOrganization(organizationId: string): Promise<Board[]> {
    return this.boardRepo.findByOrganization(organizationId);
  }

  async updateBoard(id: string, changes: { name?: string }): Promise<Board> {
    await this.getBoardById(id); // throws NotFoundError if missing
    const updated = await this.boardRepo.update(id, changes);
    if (!updated) {
      throw new NotFoundError(`Board ${id} not found`);
    }
    return updated;
  }
}
