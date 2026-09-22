import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  MaxLength,
  Min,
} from "class-validator";

export class UpdateBOMItemDTO {
  @IsUUID()
  @IsString()
  productId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name?: string; // e.g: "Component Name", max length constraint

  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number; // Non-negative integer

  @IsNumber()
  @IsOptional()
  unitCost?: number; // Optional - non-negative decimal

  @IsNumber()
  @IsOptional()
  totalPrice?: number; // Optional - calculated as quantity * unitPrice
}
