import { IsUUID } from 'class-validator'

export class ListTasksQueryDto {
  @IsUUID()
  boardId!: string
}
