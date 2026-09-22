import { NotFoundError, ValidationError } from "../errors/domain-errors";
import { ProductRepository } from "../db/repositories/ProductRepository";
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "../domain/product.entity";

export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}
  async createProduct(input: CreateProductInput): Promise<Product> {
    if (!input.boardId || !input.name || !input.skuName) {
      throw new ValidationError("boardId, name and skuName are required");
    }
    return await this.productRepo.create(input);
  }
  async findProductById(product_id: string): Promise<Product> {
    const result = await this.productRepo.findById(product_id);
    if (!result) {
      throw new NotFoundError(`product with id= ${product_id} not found!`);
    }
    return result;
  }
  async findProductsByBoard(board_id: string): Promise<Product[]> {
    const result = await this.productRepo.findByBoard(board_id);
    if (!result) {
      throw new NotFoundError(
        `No products are owned by bord with id > ${board_id}`,
      );
    }
    return result;
  }
  async updateProduct(
    id: string,
    updates: UpdateProductInput,
  ): Promise<Product> {
    await this.findProductById(id);
    const updated = await this.productRepo.update(id, updates);
    if (!updated) {
      throw new NotFoundError(`No product in id ${id}`);
    }
    return updated;
  }
  async deleteProduct(id: string): Promise<Product | null> {
    const result = await this.productRepo.delete(id);
    if (result == null) {
      throw new NotFoundError(`No product in id ${id} to delete!`);
    }
    return result;
  }
}
