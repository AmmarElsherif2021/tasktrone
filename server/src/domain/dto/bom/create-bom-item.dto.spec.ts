import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateBOMItemDTO } from "./create-bom-item..dto";
import { createBOMItem } from "../../../../tests/factories/entities/bom-item.factory";

const { productId, partNumber, name, quantity, unitCost, totalPrice } =
  createBOMItem({});

describe("CreateBOMItemDTO", () => {
  it("accepts a valid payload with all fields", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
      quantity,
      unitCost,
      totalPrice,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("accepts a valid payload with only required fields", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
      quantity,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a payload missing the required productId", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      partNumber,
      name,
      quantity,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "productId")).toBe(true);
  });

  it("rejects a payload missing the required partNumber", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      name,
      quantity,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "partNumber")).toBe(true);
  });

  it("rejects a payload missing the required name", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      quantity,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("rejects a payload missing the required quantity", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "quantity")).toBe(true);
  });

  it("rejects a non-UUID productId", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId: "not-a-uuid",
      partNumber,
      name,
      quantity,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "productId")).toBe(true);
  });

  it("rejects a partNumber exceeding the max length", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber: "P".repeat(51),
      name,
      quantity,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "partNumber")).toBe(true);
  });

  it("accepts a partNumber at exactly the max length", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber: "P".repeat(50),
      name,
      quantity,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a name exceeding the max length", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name: "N".repeat(51),
      quantity,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("accepts a name at exactly the max length", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name: "N".repeat(50),
      quantity,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a negative quantity", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
      quantity: -1,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "quantity")).toBe(true);
  });

  it("accepts a zero quantity", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
      quantity: 0,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a non-number quantity", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
      quantity: "60" as unknown as number,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "quantity")).toBe(true);
  });

  it("rejects a non-number unitCost", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
      quantity,
      unitCost: "55.5" as unknown as number,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "unitCost")).toBe(true);
  });

  it("rejects a non-number totalPrice", async () => {
    const dto = plainToInstance(CreateBOMItemDTO, {
      productId,
      partNumber,
      name,
      quantity,
      totalPrice: "3330" as unknown as number,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "totalPrice")).toBe(true);
  });
});
