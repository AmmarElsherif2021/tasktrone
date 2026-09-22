import { ProductRepository } from "../db/repositories/ProductRepository";
import { ProductService } from "./ProductService";
import { NotFoundError, ValidationError } from "../errors/domain-errors";
import { makeProduct } from "../../tests/factories/entities/product.factory";

function mockProductRepo(): jest.Mocked<ProductRepository> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByBoard: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<ProductRepository>;
}

describe("ProductService", () => {
  // createProduct ======================
  it("createProduct() rejects a missing boardId without touching the repo", async () => {
    const repo = mockProductRepo();
    const service = new ProductService(repo);

    await expect(
      service.createProduct({ boardId: "", name: "Widget", skuName: "SKU-1" }),
    ).rejects.toThrow(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("createProduct() rejects a missing name without touching the repo", async () => {
    const repo = mockProductRepo();
    const service = new ProductService(repo);

    await expect(
      service.createProduct({ boardId: "b1", name: "", skuName: "SKU-1" }),
    ).rejects.toThrow(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("createProduct() rejects a missing skuName without touching the repo", async () => {
    const repo = mockProductRepo();
    const service = new ProductService(repo);

    await expect(
      service.createProduct({ boardId: "b1", name: "Widget", skuName: "" }),
    ).rejects.toThrow(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("createProduct() delegates to the repo once the payload is valid", async () => {
    const repo = mockProductRepo();
    const created = makeProduct({ id: "p1", boardId: "b1", name: "Widget" });
    repo.create.mockResolvedValue(created);
    const service = new ProductService(repo);

    const result = await service.createProduct({
      boardId: "b1",
      name: "Widget",
      skuName: "SKU-1",
    });

    expect(result).toEqual(created);
    expect(repo.create).toHaveBeenCalledWith({
      boardId: "b1",
      name: "Widget",
      skuName: "SKU-1",
    });
  });

  // findProductById ====================
  it("findProductById() throws NotFoundError when the repo returns null", async () => {
    const repo = mockProductRepo();
    repo.findById.mockResolvedValue(null);
    const service = new ProductService(repo);

    await expect(service.findProductById("missing")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("findProductById() returns the entity when found", async () => {
    const repo = mockProductRepo();
    const row = makeProduct({ id: "p1" });
    repo.findById.mockResolvedValue(row);
    const service = new ProductService(repo);

    const result = await service.findProductById("p1");

    expect(result).toEqual(row);
  });

  // findProductsByBoard ================
  it("findProductsByBoard() returns every row for the board", async () => {
    const repo = mockProductRepo();
    const rows = [
      makeProduct({ id: "p1", boardId: "b1" }),
      makeProduct({ id: "p2", boardId: "b1" }),
    ];
    repo.findByBoard.mockResolvedValue(rows);
    const service = new ProductService(repo);

    const result = await service.findProductsByBoard("b1");

    expect(result).toEqual(rows);
  });

  it("findProductsByBoard() returns an empty array when the board has no products", async () => {
    const repo = mockProductRepo();
    repo.findByBoard.mockResolvedValue([]);
    const service = new ProductService(repo);

    const result = await service.findProductsByBoard("b-empty");

    expect(result).toEqual([]);
  });

  // updateProduct ======================
  it("updateProduct() throws NotFoundError when the id does not exist", async () => {
    const repo = mockProductRepo();
    repo.findById.mockResolvedValue(null);
    const service = new ProductService(repo);

    await expect(
      service.updateProduct("missing", { name: "X" }),
    ).rejects.toThrow(NotFoundError);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("updateProduct() delegates to the repo when the id exists", async () => {
    const repo = mockProductRepo();
    repo.findById.mockResolvedValue(makeProduct({ id: "p1" }));
    const updated = makeProduct({ id: "p1", name: "New" });
    repo.update.mockResolvedValue(updated);
    const service = new ProductService(repo);

    const result = await service.updateProduct("p1", { name: "New" });

    expect(result).toEqual(updated);
    expect(repo.update).toHaveBeenCalledWith("p1", { name: "New" });
  });

  it("updateProduct() throws NotFoundError when the row disappears mid-update", async () => {
    const repo = mockProductRepo();
    repo.findById.mockResolvedValue(makeProduct({ id: "p1" }));
    repo.update.mockResolvedValue(null);
    const service = new ProductService(repo);

    await expect(service.updateProduct("p1", { name: "X" })).rejects.toThrow(
      NotFoundError,
    );
  });

  // deleteProduct ======================
  it("deleteProduct() throws NotFoundError when the repo returns null", async () => {
    const repo = mockProductRepo();
    repo.delete.mockResolvedValue(null);
    const service = new ProductService(repo);

    await expect(service.deleteProduct("missing")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("deleteProduct() returns the deleted row", async () => {
    const repo = mockProductRepo();
    const deleted = makeProduct({ id: "p1", archivedAt: new Date() });
    repo.delete.mockResolvedValue(deleted);
    const service = new ProductService(repo);

    const result = await service.deleteProduct("p1");

    expect(result).toEqual(deleted);
    expect(repo.delete).toHaveBeenCalledWith("p1");
  });
});
