import { makeProduct } from "../../../tests/factories/entities/product.factory";
import { MockAdapter } from "../../../tests/mocks/MockAdapter";
import { ProductRepository } from "./ProductRepository";

describe("ProductRepository", () => {
  // create test =======================
  it("create() inserts a product and returns the row", async () => {
    const adapter = new MockAdapter();
    const row = makeProduct({
      id: "1",
      boardId: "b1",
      name: "Widget",
    });
    adapter.mockNextResult([row]);
    const repo = new ProductRepository(adapter);

    const result = await repo.create({
      boardId: "b1",
      name: "Widget",
      skuName: "SOME_SKU",
    });

    expect(result).toEqual(row);
    expect(adapter.calls[0].sql).toContain("INSERT INTO boards");
    expect(adapter.calls[0].sql).toContain("RETURNING *");
    expect(adapter.calls[0].params).toEqual(["b1", "Widget"]);
  });

  it("create() throws when the adapter returns no row", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new ProductRepository(adapter);

    await expect(
      repo.create({ boardId: "b1", name: "Widget", skuName: "Some_SKU" }),
    ).rejects.toThrow("Failed to create board");
  });

  // findById test ===================
  it("findById() queries by id", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([makeProduct({ id: "1" })]);
    const repo = new ProductRepository(adapter);

    await repo.findById("1");

    expect(adapter.calls[0].sql).toContain("FROM boards");
    expect(adapter.calls[0].sql).toContain("WHERE id = $1");
    expect(adapter.calls[0].params).toEqual(["1"]);
  });

  it("findById() returns null when no row matches", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new ProductRepository(adapter);

    const result = await repo.findById("missing");

    expect(result).toBeNull();
  });

  // findByBoard test ================
  it("findByBoard() queries by board id", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new ProductRepository(adapter);

    await repo.findByBoard("b1");

    expect(adapter.calls[0].sql).toContain("WHERE board_id = $1");
    expect(adapter.calls[0].sql).toContain("ORDER BY created_at DESC");
    expect(adapter.calls[0].params).toEqual(["b1"]);
  });

  it("findByBoard() returns every matching row", async () => {
    const adapter = new MockAdapter();
    const rows = [
      makeProduct({ id: "1", boardId: "b1" }),
      makeProduct({ id: "2", boardId: "b1" }),
    ];
    adapter.mockNextResult(rows);
    const repo = new ProductRepository(adapter);

    const result = await repo.findByBoard("b1");

    expect(result).toEqual(rows);
    expect(result).toHaveLength(2);
  });

  // update test =====================
  it("update() sets name when provided", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([makeProduct({ id: "1", name: "New Name" })]);
    const repo = new ProductRepository(adapter);

    await repo.update("1", { name: "New Name" });

    expect(adapter.calls[0].sql).toContain("UPDATE boards");
    expect(adapter.calls[0].sql).toContain("name = $1");
    expect(adapter.calls[0].sql).toContain("updated_at = NOW()");
    expect(adapter.calls[0].sql).toContain("WHERE id = $2");
    expect(adapter.calls[0].params).toEqual(["New Name", "1"]);
  });

  it("update() with no changes just re-fetches the row (no adapter write)", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([makeProduct({ id: "1" })]);
    const repo = new ProductRepository(adapter);

    await repo.update("1", {});

    expect(adapter.calls[0].sql).toBe("SELECT * FROM boards WHERE id = $1");
    expect(adapter.calls[0].params).toEqual(["1"]);
  });

  it("update() with name: undefined also falls through to findById", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([makeProduct({ id: "1" })]);
    const repo = new ProductRepository(adapter);

    await repo.update("1", { name: undefined });

    expect(adapter.calls[0].sql).toBe("SELECT * FROM boards WHERE id = $1");
    expect(adapter.calls[0].params).toEqual(["1"]);
  });

  it("update() returns null when the row does not exist", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new ProductRepository(adapter);

    const result = await repo.update("missing", { name: "X" });

    expect(result).toBeNull();
  });
  // delete test =====================
  it("delete() soft-deletes by setting archived_at", async () => {
    const adapter = new MockAdapter();
    const row = makeProduct({ id: "1", archivedAt: new Date() });
    adapter.mockNextResult([row]);
    const repo = new ProductRepository(adapter);

    const result = await repo.delete("1");

    expect(result).toEqual(row);
    expect(adapter.calls[0].sql).toContain("UPDATE products");
    expect(adapter.calls[0].sql).toContain("archived_at = NOW()");
    expect(adapter.calls[0].sql).toContain("archived_at IS NULL");
    expect(adapter.calls[0].sql).toContain("WHERE id = $1");
    expect(adapter.calls[0].params).toEqual(["1"]);
  });

  it("delete() returns null when the row is missing or already archived", async () => {
    const adapter = new MockAdapter();
    adapter.mockNextResult([]);
    const repo = new ProductRepository(adapter);

    const result = await repo.delete("missing");

    expect(result).toBeNull();
  });
});
