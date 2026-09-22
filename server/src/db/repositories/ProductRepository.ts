import { DBAdapter } from "../adapter";
import { Product, ProductStage } from "../../domain/product.entity";
interface CreateProductInput {
  // @IsUUID()
  boardId: string;
  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(255)
  name: string;
  // @IsString()
  // @IsNotEmpty()
  // @MaxLength(255)
  skuName: string;
  // @IsOptional()
  // @IsString()
  // @MaxLength(1020)
  description?: string;
  // @IsOptional()
  // @IsIn(PRODUCT_STAGES)
  currentStage?: ProductStage;
  // @IsOptional()
  // @IsUrl()
  active_3d_model_url?: string | null;
  // @IsOptional()
  //  @IsNumber()
  //  @Min(0)
  targetBudget?: number;
  //  @IsOptional()
  //  @IsUUID()
  ownerId?: string;
}
interface UpdateProductInput {
  // @IsOptional()
  // @IsString()
  // @MaxLength(255)
  name?: string;

  // @IsOptional()
  // @IsString()
  // @MaxLength(1020)
  description?: string;

  // @IsOptional()
  // @IsIn(PRODUCT_STAGES)
  currentStage?: ProductStage;

  // @IsOptional()
  // @IsUrl()
  active_3d_model_url?: string | null;

  // @IsOptional()
  // @Transform(({ value }) =>
  // @IsNumber()
  // @Min(0)
  targetBudget?: number;

  // @IsOptional()
  // @IsUUID()
  ownerId?: string;

  // @IsOptional()
  // @IsNumber()
  version?: number;

  // @IsOptional()
  // @IsDate()
  archivedAt?: Date | null;

  // @IsDate()
  updatedAt: Date;
}
export class ProductRepository {
  constructor(private readonly db: DBAdapter) {}
  async create(input: CreateProductInput): Promise<Product> {
    const row = await this.db.queryOne<Product>(
      "INSERT INTO boards (board_id, name) VALUES ($1, $2) RETURNING *",
      [input.boardId, input.name],
    );
    if (!row) throw new Error("Failed to create board");
    return row;
  }

  async findById(id: string): Promise<Product | null> {
    return this.db.queryOne<Product>("SELECT * FROM boards WHERE id = $1", [
      id,
    ]);
  }

  async findByBoard(boardId: string): Promise<Product[]> {
    return this.db.query<Product>(
      "SELECT * FROM boards WHERE board_id = $1 ORDER BY created_at DESC",
      [boardId],
    );
  }

  async update(
    id: string,
    changes: UpdateProductInput,
  ): Promise<Product | null> {
    if (changes.name === undefined) {
      return this.findById(id);
    }
    return this.db.queryOne<Product>(
      "UPDATE boards SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [changes.name, id],
    );
  }

  async delete(id: string): Promise<Product | null> {
    return this.db.queryOne<Product>(
      `UPDATE products
        SET archived_at = NOW(),
            updated_at  = NOW()
      WHERE id = $1
        AND archived_at IS NULL
      RETURNING *`,
      [id],
    );
  }
}
