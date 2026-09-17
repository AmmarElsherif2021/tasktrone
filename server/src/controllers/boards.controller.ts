import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateBoardDto } from "../domain/dto/board/create-board.dto";
import { BoardService } from "../services/BoardService";

@Controller("boards")
export class BoardsController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  create(@Body() dto: CreateBoardDto) {
    return this.boardService.createBoard(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.boardService.getBoardById(id);
  }
}
