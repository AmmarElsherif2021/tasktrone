import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateBOMItemDTO } from "./update-bom-item.dto";
import { createRandomBOMItem } from "../../../../tests/factories/entities/bom-item.factory";

const { productId, partNumber, name, quantity, unitCost, totalPrice } =
  createRandomBOMItem({});

describe("UpdateBOMItemDTO", () => {
  it("accepts a valid full payload", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
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

  it("accepts an empty payload", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {});

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("accepts a partial payload", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, { name });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a non-UUID productId when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      productId: "not-a-uuid",
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "productId")).toBe(true);
  });

  it("rejects a partNumber exceeding the max length when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      partNumber: "P".repeat(51),
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "partNumber")).toBe(true);
  });

  it("accepts a partNumber at exactly the max length when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      partNumber: "P".repeat(50),
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a name exceeding the max length when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      name: "N".repeat(51),
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("accepts a name at exactly the max length when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      name: "N".repeat(50),
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a negative quantity when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      quantity: -1,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "quantity")).toBe(true);
  });

  it("accepts a zero quantity when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      quantity: 0,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a non-number quantity when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      quantity: "60" as unknown as number,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "quantity")).toBe(true);
  });

  it("rejects a non-number unitCost when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      unitCost: "55.5" as unknown as number,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "unitCost")).toBe(true);
  });

  it("rejects a non-number totalPrice when provided", async () => {
    const dto = plainToInstance(UpdateBOMItemDTO, {
      totalPrice: "3330" as unknown as number,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "totalPrice")).toBe(true);
  });
});
