import { DBAdapter } from "../../../src/db/adapter";
import { Product } from "../../../src/domain/product.entity";
import { ProductRepository } from "../../../src/db/repositories/ProductRepository";
import { makeProduct } from "tests/factories/entities";
export async function seedProducts(
  db: DBAdapter,
  boardId: string,
  overrides: Partial<
    Pick<
      Product,
      "id" | "name" | "boardId" | "description" | "active_3d_model_url"
    >
  > = {},
): Promise<Product> {
  const defaultProduct: Partial<Product> = makeProduct({});
  return new ProductRepository(db).create({
    boardId: boardId,
    ...defaultProduct,
    ...overrides,
  });
}
