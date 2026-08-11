import { IsString, IsUUID, MaxLength } from 'class-validator'

export class CreateBoardDto {
  @IsUUID()
  organizationId!: string

  @IsString()
  @MaxLength(255)
  name!: string
}
