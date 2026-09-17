import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateTaskDto } from "../domain/dto/task/create-task.dto";
import { ListTasksQueryDto } from "../domain/dto/task/list-tasks-query.dto";
import { UpdateTaskDto } from "../domain/dto/task/update-task.dto";
import { TaskService } from "../services/TaskService";

@Controller("tasks")
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.taskService.createTask(dto);
  }

  @Get()
  findByBoard(@Query() query: ListTasksQueryDto) {
    return this.taskService.getTasksByBoard(query.boardId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.updateTask(id, dto);
  }
}
