import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateProductDTO } from "./update-product.dto";
import { makeProduct } from "../../../../tests/factories/entities/product.factory";

const {
  name,
  description,
  currentStage,
  active_3d_model_url,
  targetBudget,
  ownerId,
  version,
  archivedAt,
  updatedAt,
} = makeProduct({});

describe("UpdateProductDTO", () => {
  it("accepts a valid payload with all fields", async () => {
    const dto: UpdateProductDTO = plainToInstance(UpdateProductDTO, {
      name,
      description,
      currentStage,
      active_3d_model_url,
      targetBudget,
      ownerId,
      version,
      archivedAt,
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("accepts a valid payload with only the required updatedAt", async () => {
    const dto = plainToInstance(UpdateProductDTO, { updatedAt });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a payload missing the required updatedAt", async () => {
    const dto = plainToInstance(UpdateProductDTO, { name });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "updatedAt")).toBe(true);
  });

  it("rejects a non-Date updatedAt", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      updatedAt: "2024-01-01" as unknown as Date,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "updatedAt")).toBe(true);
  });

  it("rejects a name exceeding the max length", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      name: "a".repeat(256),
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });

  it("rejects a description exceeding the max length", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      description: "d".repeat(1021),
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "description")).toBe(true);
  });

  it("rejects a currentStage not in PRODUCT_STAGES", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      currentStage: "not-a-stage",
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "currentStage")).toBe(true);
  });

  it.each(["draft", "in-progress", "completed", "archived"])(
    "accepts valid currentStage '%s'",
    async (stage) => {
      const dto = plainToInstance(UpdateProductDTO, {
        currentStage: stage,
        updatedAt,
      });

      const errors = await validate(dto);

      expect(errors).toHaveLength(0);
    },
  );

  it("rejects an invalid active_3d_model_url", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      active_3d_model_url: "not-a-url",
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "active_3d_model_url")).toBe(true);
  });

  it("accepts a null active_3d_model_url", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      active_3d_model_url: null,
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "active_3d_model_url")).toBe(
      false,
    );
  });

  it("rejects a non-UUID ownerId", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      ownerId: "not-a-uuid",
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "ownerId")).toBe(true);
  });

  it("rejects a non-number version", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      version: "4.1",
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "version")).toBe(true);
  });

  it("accepts a null archivedAt", async () => {
    const dto = plainToInstance(UpdateProductDTO, {
      archivedAt: null,
      updatedAt,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "archivedAt")).toBe(false);
  });
});
