import {
  BOMItemRepository,
  CreateBOMItemInput,
  UpdateBOMItemInput,
} from "../db/repositories/BOMItemRepository";
import { BomItem } from "../domain/bom-item.entity";
import { NotFoundError, ValidationError } from "../errors/domain-errors";

export class BOMItemService {
  constructor(private readonly repo: BOMItemRepository) {}
  async createBOMItem(input: CreateBOMItemInput): Promise<BomItem> {
    if (!input.name || !input.partNumber || !input.productId) {
      throw new ValidationError("name, partNumber and productId are required!");
    }
    return this.repo.create(input);
  }
  async findBOMItenById(id: string): Promise<BomItem> {
    const result = await this.repo.findById(id);
    if (!result) {
      throw new NotFoundError(`BOMItem with id ${id} Not found`);
    }
    return result;
  }
  async findBOMItemsByProduct(product_id: string): Promise<BomItem[]> {
    const result = await this.repo.findByProduct(product_id);
    if (!result) {
      throw new NotFoundError(
        `BOMItem with board id = ${product_id} not found!`,
      );
    }
    return result;
  }
  async getCumulativeCost(productId: string): Promise<number> {
    const productBOMItems = await this.findBOMItemsByProduct(productId);

    let cost = 0;
    for (const item of productBOMItems) {
      if (item.totalPrice == null) {
        throw new ValidationError(
          `Cannot compute cumulative cost: BOM item ${item.id} (product ${item.productId}) is missing totalPrice`,
        );
      }
      cost += item.totalPrice;
    }
    return cost;
  }
  async updateBOMItem(
    id: string,
    updates: UpdateBOMItemInput,
  ): Promise<BomItem | null> {
    await this.findBOMItenById(id);
    const updated = await this.repo.update(id, updates);
    if (!updated || updated == null) {
      throw new NotFoundError(`No BomItem with id ${id} found!`);
    }
    return updated;
  }
  async deleteBOMItem(bom_id: string): Promise<BomItem | null> {
    const result = await this.repo.delete(bom_id);
    if (result == null) {
      throw new NotFoundError(`No bom_id = ${bom_id} found to delete!`);
    }
    return result;
  }
}
