import { DBAdapter } from "../../../src/db/adapter";
import { BOMItemRepository } from "../../../src/db/repositories/BOMItemRepository";
import { BomItem } from "../../../src/domain/bom-item.entity";
import { createBOMItem } from "../../../tests/factories/entities/bom-item.factory";

export async function seedBOMItems(
  db: DBAdapter,
  productId: string,
  overrides: Partial<
    Pick<BomItem, "id" | "partNumber" | "name" | "quantity" | "unitCost">
  >,
): Promise<BomItem> {
  const defaultBOMItem: BomItem = createBOMItem({});
  return new BOMItemRepository(db).create({
    ...defaultBOMItem,
    ...overrides,
    productId,
  });
}
