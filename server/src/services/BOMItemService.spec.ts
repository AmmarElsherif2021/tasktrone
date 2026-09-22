import { BOMItemRepository } from "../db/repositories/BOMItemRepository";
import { BOMItemService } from "./BOMItemService";
import { NotFoundError, ValidationError } from "../errors/domain-errors";
import { createBOMItem } from "../../tests/factories/entities/bom-item.factory";

function mockBOMItemRepo(): jest.Mocked<BOMItemRepository> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByProduct: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<BOMItemRepository>;
}

describe("BOMItemService", () => {
  // createBOMItem ======================
  it("createBOMItem() rejects an empty name without touching the repo", async () => {
    const repo = mockBOMItemRepo();
    const service = new BOMItemService(repo);

    await expect(
      service.createBOMItem({
        productId: "p1",
        partNumber: "PN-1",
        name: "",
        quantity: 1,
      }),
    ).rejects.toThrow(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("createBOMItem() rejects an empty partNumber without touching the repo", async () => {
    const repo = mockBOMItemRepo();
    const service = new BOMItemService(repo);

    await expect(
      service.createBOMItem({
        productId: "p1",
        partNumber: "",
        name: "Screw",
        quantity: 1,
      }),
    ).rejects.toThrow(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("createBOMItem() rejects an empty productId without touching the repo", async () => {
    const repo = mockBOMItemRepo();
    const service = new BOMItemService(repo);

    await expect(
      service.createBOMItem({
        productId: "",
        partNumber: "PN-1",
        name: "Screw",
        quantity: 1,
      }),
    ).rejects.toThrow(ValidationError);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it("createBOMItem() delegates to the repo once the payload is valid", async () => {
    const repo = mockBOMItemRepo();
    const created = createBOMItem({ id: "b1", productId: "p1", name: "Screw" });
    repo.create.mockResolvedValue(created);
    const service = new BOMItemService(repo);

    const result = await service.createBOMItem({
      productId: "p1",
      partNumber: "PN-1",
      name: "Screw",
      quantity: 10,
      unitCost: 0.5,
    });

    expect(result).toEqual(created);
    expect(repo.create).toHaveBeenCalledWith({
      productId: "p1",
      partNumber: "PN-1",
      name: "Screw",
      quantity: 10,
      unitCost: 0.5,
    });
  });

  // findBOMItenById ====================
  it("findBOMItenById() throws NotFoundError when the repo returns null", async () => {
    const repo = mockBOMItemRepo();
    repo.findById.mockResolvedValue(null);
    const service = new BOMItemService(repo);

    await expect(service.findBOMItenById("missing")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("findBOMItenById() returns the entity when found", async () => {
    const repo = mockBOMItemRepo();
    const row = createBOMItem({ id: "b1" });
    repo.findById.mockResolvedValue(row);
    const service = new BOMItemService(repo);

    const result = await service.findBOMItenById("b1");

    expect(result).toEqual(row);
  });

  // findBOMItemsByProduct ==============
  it("findBOMItemsByProduct() returns every row for the product", async () => {
    const repo = mockBOMItemRepo();
    const rows = [
      createBOMItem({ id: "b1", productId: "p1" }),
      createBOMItem({ id: "b2", productId: "p1" }),
    ];
    repo.findByProduct.mockResolvedValue(rows);
    const service = new BOMItemService(repo);

    const result = await service.findBOMItemsByProduct("p1");

    expect(result).toEqual(rows);
  });

  it("findBOMItemsByProduct() returns an empty array when the product has no items", async () => {
    const repo = mockBOMItemRepo();
    repo.findByProduct.mockResolvedValue([]);
    const service = new BOMItemService(repo);

    const result = await service.findBOMItemsByProduct("p-empty");

    expect(result).toEqual([]);
  });

  // updateBOMItem ======================
  it("updateBOMItem() throws NotFoundError when the id does not exist", async () => {
    const repo = mockBOMItemRepo();
    repo.findById.mockResolvedValue(null);
    const service = new BOMItemService(repo);

    await expect(
      service.updateBOMItem("missing", { name: "Bolt" }),
    ).rejects.toThrow(NotFoundError);
    expect(repo.update).not.toHaveBeenCalled();
  });

  it("updateBOMItem() delegates to the repo when the id exists", async () => {
    const repo = mockBOMItemRepo();
    repo.findById.mockResolvedValue(createBOMItem({ id: "b1" }));
    const updated = createBOMItem({ id: "b1", name: "Bolt" });
    repo.update.mockResolvedValue(updated);
    const service = new BOMItemService(repo);

    const result = await service.updateBOMItem("b1", { name: "Bolt" });

    expect(result).toEqual(updated);
    expect(repo.update).toHaveBeenCalledWith("b1", { name: "Bolt" });
  });

  it("updateBOMItem() throws NotFoundError when the row disappears mid-update", async () => {
    const repo = mockBOMItemRepo();
    repo.findById.mockResolvedValue(createBOMItem({ id: "b1" }));
    repo.update.mockResolvedValue(null);
    const service = new BOMItemService(repo);

    await expect(service.updateBOMItem("b1", { name: "Bolt" })).rejects.toThrow(
      NotFoundError,
    );
  });

  // deleteBOMItem ======================
  it("deleteBOMItem() throws NotFoundError when the repo returns null", async () => {
    const repo = mockBOMItemRepo();
    repo.delete.mockResolvedValue(null);
    const service = new BOMItemService(repo);

    await expect(service.deleteBOMItem("missing")).rejects.toThrow(
      NotFoundError,
    );
  });

  it("deleteBOMItem() returns the deleted row", async () => {
    const repo = mockBOMItemRepo();
    const deleted = createBOMItem({ id: "b1" });
    repo.delete.mockResolvedValue(deleted);
    const service = new BOMItemService(repo);

    const result = await service.deleteBOMItem("b1");

    expect(result).toEqual(deleted);
    expect(repo.delete).toHaveBeenCalledWith("b1");
  });
  // getCumulativeCost ==================
  it("getCumulativeCost() returns 0 when the product has no items", async () => {
    const repo = mockBOMItemRepo();
    repo.findByProduct.mockResolvedValue([]);
    const service = new BOMItemService(repo);

    const result = await service.getCumulativeCost("p-empty");

    expect(result).toBe(0);
    expect(repo.findByProduct).toHaveBeenCalledWith("p-empty");
  });

  it("getCumulativeCost() sums totalPrice across every item", async () => {
    const repo = mockBOMItemRepo();
    repo.findByProduct.mockResolvedValue([
      createBOMItem({ id: "b1", productId: "p1", totalPrice: 10 }),
      createBOMItem({ id: "b2", productId: "p1", totalPrice: 5.25 }),
    ]);
    const service = new BOMItemService(repo);

    const result = await service.getCumulativeCost("p1");

    expect(result).toBeCloseTo(15.25);
  });

  it("getCumulativeCost() treats a totalPrice of 0 as valid", async () => {
    const repo = mockBOMItemRepo();
    repo.findByProduct.mockResolvedValue([
      createBOMItem({ id: "b1", productId: "p1", totalPrice: 0 }),
      createBOMItem({ id: "b2", productId: "p1", totalPrice: 5 }),
    ]);
    const service = new BOMItemService(repo);

    const result = await service.getCumulativeCost("p1");

    expect(result).toBe(5);
  });

  it("getCumulativeCost() throws ValidationError when an item is missing totalPrice", async () => {
    const repo = mockBOMItemRepo();
    repo.findByProduct.mockResolvedValue([
      createBOMItem({ id: "b1", productId: "p1", totalPrice: 10 }),
      createBOMItem({ id: "b2", productId: "p1", totalPrice: undefined }),
    ]);
    const service = new BOMItemService(repo);

    await expect(service.getCumulativeCost("p1")).rejects.toThrow(
      ValidationError,
    );
  });

  it("getCumulativeCost() propagates NotFoundError when the product does not exist", async () => {
    const repo = mockBOMItemRepo();
    // repo.findById/ByProduct returns null for unknown products
    repo.findByProduct.mockResolvedValue(null as unknown as never);
    const service = new BOMItemService(repo);

    await expect(service.getCumulativeCost("missing")).rejects.toThrow(
      NotFoundError,
    );
  });
});
