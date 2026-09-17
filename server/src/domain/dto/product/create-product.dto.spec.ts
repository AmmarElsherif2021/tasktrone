import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateProductDTO } from "./create-product.dto";
import { makeProduct } from "../../../../tests/factories/entities/product.factory";

const { boardId, name, skuName, description, targetBudget, ownerId } =
  makeProduct({});

describe("CreateProductDTO", () => {
  it("accepts a valid payload with all fields", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name,
      skuName,
      description,
      targetBudget,
      ownerId,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("accepts a valid payload with only required fields", async () => {
    const dto = plainToInstance(CreateProductDTO, { boardId, name, skuName });
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a payload missing the required boardId", async () => {
    const dto = plainToInstance(CreateProductDTO, { name, skuName });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "boardId")).toBe(true);
  });

  it("rejects a payload missing the required name", async () => {
    const dto = plainToInstance(CreateProductDTO, { boardId, skuName });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("rejects an empty name", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name: "",
      skuName,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("rejects a payload missing the required skuName", async () => {
    const dto = plainToInstance(CreateProductDTO, { boardId, name });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "skuName")).toBe(true);
  });

  it("rejects a non-UUID boardId", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId: "not-a-uuid",
      name,
      skuName,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "boardId")).toBe(true);
  });

  it("rejects a non-UUID ownerId", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name,
      skuName,
      ownerId: "not-a-uuid",
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "ownerId")).toBe(true);
  });

  it("accepts a name at exactly the max length", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name: "a".repeat(225),
      skuName,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a name exceeding the max length", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name: "a".repeat(255 + 1),
      skuName,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("rejects a skuName exceeding the max length", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name,
      skuName: "s".repeat(255 + 1),
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "skuName")).toBe(true);
  });

  it("rejects a description exceeding the max length", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name,
      skuName,
      description: "d".repeat(1020 + 1),
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "description")).toBe(true);
  });

  // it("rejects a non-number targetBudget", async () => {
  //   const dto = plainToInstance(CreateProductDTO, {
  //     boardId,
  //     name,
  //     skuName,
  //     targetBudget: "44",
  //   });

  //   const errors = await validate(dto);

  //   expect(errors.some((e) => e.property === "targetBudget")).toBe(true);
  // });

  it("accepts a zero targetBudget", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name,
      skuName,
      targetBudget: 0,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a negative targetBudget", async () => {
    const dto = plainToInstance(CreateProductDTO, {
      boardId,
      name,
      skuName,
      targetBudget: -1,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "targetBudget")).toBe(true);
  });
});
