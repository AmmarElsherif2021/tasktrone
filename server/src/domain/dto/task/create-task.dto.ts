import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Position3DDto } from "./position3d.dto";

export class CreateTaskDto {
  @IsUUID()
  boardId!: string;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Position3DDto)
  position3d?: Position3DDto;

  @IsOptional()
  @IsString()
  modelRef?: string;
}
