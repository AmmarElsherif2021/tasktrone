import { createBOMItem } from "../../../tests/factories/entities/bom-item.factory";
import { MockAdapter } from "../../../tests/mocks/MockAdapter";
import { BOMItemRepository } from "./BOMItemRepository";

describe("BOMItemRepository", () => {
  // create test =======================
  it("create() inserts a BOM item and returns the row", async () => {
    const adapter = new MockAdapter();
    const row = createBOMItem({
      id: "1",
      productId: "p1",
      partNumber: "PN-1",
      name: "Screw",
      quantity: 10,
      unitCost: 0.5,
    });
    adapter.mockNextResult([row]);
    const repo = new BOMItemRepository(adapter);

    const result = await repo.create({
      productId: "p1",
      partNumber: "PN-1",
      name: "Screw",
      quantity: 10,
      unitCost: 0.5,
    });

    expect(result).toEqual(row);
    expect(adapter.calls[0].sql).toContain("INSERT INTO bom_items");
    expect(adapter.calls[0].params).toEqual(["p1", "PN-1", "Screw", 10, 0.5]);
  });

  it("create() defaults unitCost to 0 when omitted", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([createBOMItem({ id: "1" })]);
    const repo = new BOMItemRepository(adapter);

    await repo.create({
      productId: "p1",
      partNumber: "PN-1",
      name: "Screw",
      quantity: 10,
    });

    expect(adapter.calls[0].params).toEqual(["p1", "PN-1", "Screw", 10, 0]);
  });

  it("create() throws when the adapter returns no row", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new BOMItemRepository(adapter);

    await expect(
      repo.create({
        productId: "p1",
        partNumber: "PN-1",
        name: "Screw",
        quantity: 1,
      }),
    ).rejects.toThrow();
  });

  // findById test ===================[]

  it("findById() queries by id", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([createBOMItem({ id: "1" })]);
    const repo = new BOMItemRepository(adapter);

    await repo.findById("1");

    expect(adapter.calls[0].sql).toContain("FROM bom_items");
    expect(adapter.calls[0].sql).toContain("WHERE id = $1");
    expect(adapter.calls[0].params).toEqual(["1"]);
  });

  it("findById() returns null when no row matches", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new BOMItemRepository(adapter);

    const result = await repo.findById("missing");

    expect(result).toBeNull();
  });

  // findByProduct test =========
  it("findByProduct() queries by product id", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new BOMItemRepository(adapter);

    await repo.findByProduct("p1");

    expect(adapter.calls[0].sql).toContain("WHERE product_id = $1");
    expect(adapter.calls[0].sql).toContain("ORDER BY created_at DESC");
    expect(adapter.calls[0].params).toEqual(["p1"]);
  });

  it("findByProduct() returns every matching row", async () => {
    const adapter = new MockAdapter();
    const rows = [
      createBOMItem({ id: "1", productId: "p1" }),
      createBOMItem({ id: "2", productId: "p1" }),
    ];
    adapter.mockNextResult(rows);
    const repo = new BOMItemRepository(adapter);

    const result = await repo.findByProduct("p1");

    expect(result).toEqual(rows);
    expect(result).toHaveLength(2);
  });

  // update test ===========

  it("update() only sets the provided fields", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([createBOMItem({ id: "1", name: "Bolt" })]);
    const repo = new BOMItemRepository(adapter);

    await repo.update("1", { name: "Bolt" });

    expect(adapter.calls[0].sql).toContain("name = $1");
    expect(adapter.calls[0].sql).not.toContain("quantity =");
    expect(adapter.calls[0].sql).not.toContain("unit_cost =");
    expect(adapter.calls[0].sql).toContain("updated_at = NOW()");
    expect(adapter.calls[0].params).toEqual(["Bolt", "1"]);
  });

  it("update() converts camelCase keys to snake_case columns", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([createBOMItem({ id: "1" })]);
    const repo = new BOMItemRepository(adapter);

    await repo.update("1", { unitCost: 2.5 });

    expect(adapter.calls[0].sql).toContain("unit_cost = $1");
    expect(adapter.calls[0].sql).not.toContain("unitCost");
    expect(adapter.calls[0].params).toEqual([2.5, "1"]);
  });

  it("update() sets several fields in a single statement", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([createBOMItem({ id: "1" })]);
    const repo = new BOMItemRepository(adapter);

    await repo.update("1", { name: "Bolt", quantity: 5, unitCost: 1.25 });

    expect(adapter.calls[0].sql).toContain("name = $1");
    expect(adapter.calls[0].sql).toContain("quantity = $2");
    expect(adapter.calls[0].sql).toContain("unit_cost = $3");
    // final placeholder is the id in the WHERE clause
    expect(adapter.calls[0].sql).toContain("WHERE id = $4");
    expect(adapter.calls[0].params).toEqual(["Bolt", 5, 1.25, "1"]);
  });

  it("update() with no changes just re-fetches the row (no adapter write)", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([createBOMItem({ id: "1" })]);
    const repo = new BOMItemRepository(adapter);

    await repo.update("1", {});

    expect(adapter.calls[0].sql).toBe("SELECT * FROM bom_items WHERE id = $1");
    expect(adapter.calls[0].params).toEqual(["1"]);
  });

  it("update() returns null when the row does not exist", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new BOMItemRepository(adapter);

    const result = await repo.update("missing", { name: "Bolt" });

    expect(result).toBeNull();
  });
  // delete test =====================
  it("delete() removes the row and returns it", async () => {
    const adapter = new MockAdapter();
    const row = createBOMItem({ id: "1" });
    adapter.mockNextResult([row]);
    const repo = new BOMItemRepository(adapter);

    const result = await repo.delete("1");

    expect(result).toEqual(row);
    expect(adapter.calls[0].sql).toContain("DELETE FROM bom_items");
    expect(adapter.calls[0].sql).toContain("WHERE id = $1");
    expect(adapter.calls[0].params).toEqual(["1"]);
  });

  it("delete() returns null when the row does not exist", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new BOMItemRepository(adapter);

    const result = await repo.delete("missing");

    expect(result).toBeNull();
  });
});
