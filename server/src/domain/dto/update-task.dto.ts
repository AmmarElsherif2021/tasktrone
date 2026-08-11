import { Type } from 'class-transformer'
import { IsIn, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator'
import { Position3DDto } from './position3d.dto'
import { TaskStatus } from '../task.entity'

const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'review', 'done']

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: TaskStatus

  @IsOptional()
  @ValidateNested()
  @Type(() => Position3DDto)
  position3d?: Position3DDto

  @IsOptional()
  @IsString()
  modelRef?: string
}
