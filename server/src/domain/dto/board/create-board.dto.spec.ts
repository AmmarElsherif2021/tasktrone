import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateBoardDto } from "./create-board.dto";
import { makeBoard } from "../../../../tests/factories/entities";

const { organizationId, name } = makeBoard();

describe("CreateBoardDto", () => {
  it("accepts a valid payload", async () => {
    const dto = plainToInstance(CreateBoardDto, {
      organizationId,
      name,
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects a non-UUID organizationId", async () => {
    const dto = plainToInstance(CreateBoardDto, {
      organizationId: "not-a-uuid",
      name,
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "organizationId")).toBe(true);
  });

  it("rejects a missing name", async () => {
    const dto = plainToInstance(CreateBoardDto, { organizationId });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "name")).toBe(true);
  });
});
