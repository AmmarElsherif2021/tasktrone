import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  MaxLength,
  IsIn,
  IsUrl,
  IsNotEmpty,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";
import {
  ProductStage,
  PRODUCT_STAGES,
} from "../../../../src/domain/product.entity";

export class CreateProductDTO {
  @IsUUID()
  boardId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  skuName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1020)
  description?: string;

  @IsOptional()
  @IsIn(PRODUCT_STAGES)
  currentStage?: ProductStage;

  @IsOptional()
  @IsUrl()
  active_3d_model_url?: string | null;

  @IsOptional()
  @Transform(({ value }) =>
    value === null || value === undefined ? value : Number(value),
  )
  @IsNumber()
  @Min(0)
  targetBudget?: number;

  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
