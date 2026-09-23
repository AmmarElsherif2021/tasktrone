// db/seeders/product.seeder.ts
import { DBAdapter } from "../../../src/db/adapter";
import { Product } from "../../../src/domain/product.entity";
import { ProductRepository } from "../../../src/db/repositories/ProductRepository";
import { makeProduct } from "tests/factories/entities";

type SeedProductOverrides = Partial<
  Pick<
    Product,
    | "name"
    | "boardId"
    | "skuName"
    | "description"
    | "currentStage"
    | "active_3d_model_url"
    | "targetBudget"
    | "ownerId"
  >
>;

export async function seedProducts(
  db: DBAdapter,
  boardId: string,
  overrides: SeedProductOverrides = {},
): Promise<Product> {
  // fully-populated draft with sensible defaults.
  const draft = makeProduct({ boardId, ...overrides });
  return new ProductRepository(db).create({
    boardId: draft.boardId,
    name: draft.name,
    skuName: draft.skuName,
    description: draft.description,
    currentStage: draft.currentStage,
    active_3d_model_url: draft.active_3d_model_url,
    targetBudget: draft.targetBudget,
    ownerId: draft.ownerId,
  });
}
