import { IsNumber } from 'class-validator'

export class Position3DDto {
  @IsNumber()
  x!: number

  @IsNumber()
  y!: number

  @IsNumber()
  z!: number
}
