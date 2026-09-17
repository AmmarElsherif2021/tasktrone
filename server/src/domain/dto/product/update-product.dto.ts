import {
  IsUUID,
  IsNumber,
  IsString,
  IsOptional,
  MaxLength,
  IsIn,
  IsUrl,
  IsDate,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";
import {
  ProductStage,
  PRODUCT_STAGES,
} from "../../../../src/domain/product.entity";

export class UpdateProductDTO {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

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

  @IsOptional()
  @IsNumber()
  version?: number;

  @IsOptional()
  @IsDate()
  archivedAt?: Date | null;

  @IsDate()
  updatedAt!: Date;
}
