import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  MaxLength,
  Min,
} from "class-validator";

export class CreateBOMItemDTO {
  @IsUUID()
  productId!: string;

  @IsString()
  @MaxLength(50)
  partNumber!: string; // e.g: "PN12345", max length constraint

  @IsString()
  @MaxLength(50)
  name!: string; // e.g: "Component Name", max length constraint

  @IsNumber()
  @Min(0)
  quantity!: number; // Non-negative integer

  @IsNumber()
  @IsOptional()
  unitCost?: number; // Optional - non-negative decimal

  @IsNumber()
  @IsOptional()
  totalPrice?: number; // Optional - calculated as quantity * unitPrice
}
