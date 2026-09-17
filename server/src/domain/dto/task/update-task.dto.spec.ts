import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { UpdateTaskDto } from "./update-task.dto";
import { makeTask } from "../../../../tests/factories/entities";

describe("UpdateTaskDto", () => {
  it("accepts a partial update with a valid status", async () => {
    const { status } = makeTask({ status: "in_progress" });
    const dto = plainToInstance(UpdateTaskDto, { status });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("accepts an empty payload (all fields optional)", async () => {
    const dto = plainToInstance(UpdateTaskDto, {});

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it("rejects an invalid status", async () => {
    const dto = plainToInstance(UpdateTaskDto, { status: "archived" });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "status")).toBe(true);
  });

  it("rejects an invalid position3d", async () => {
    const { position3d } = makeTask();
    const dto = plainToInstance(UpdateTaskDto, {
      position3d: { x: position3d!.x, y: position3d!.y },
    });

    const errors = await validate(dto);

    expect(errors.some((e) => e.property === "position3d")).toBe(true);
  });
});
