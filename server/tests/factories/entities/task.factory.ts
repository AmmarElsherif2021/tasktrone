import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { Task } from "../../../src/domain/task.entity";
// This used for fixed and deterministic tests
export const makeTask = (overrides?: Partial<Task>): Task => {
  const defaultTask: Task = {
    id: randomUUID(),
    boardId: randomUUID(),
    title: "Sample Task",
    description: undefined,
    status: "todo",
    position3d: undefined,
    modelRef: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { ...defaultTask, ...overrides };
};

// For randomized tests, e.g. for property-based testing
export const makeRandomTask = (overrides?: Partial<Task>): Task => {
  const randomTask: Task = {
    id: faker.string.uuid(),
    boardId: faker.string.uuid(),
    title: `Task ${Math.floor(Math.random() * 1000)}`,
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(["todo", "in_progress", "done"]),
    position3d: {
      x: faker.number.int({ min: 0, max: 100 }),
      y: faker.number.int({ min: 0, max: 100 }),
      z: faker.number.int({ min: 0, max: 100 }),
    },
    modelRef: undefined,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
  return { ...randomTask, ...overrides };
};
