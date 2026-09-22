import { randomUUID } from "crypto";
import { Board } from "../../../src/domain/board.entity";
import { faker } from "@faker-js/faker";

// This used for fixed and deterministic defaults
export const makeBoard = (overrides?: Partial<Board>): Board => {
  const defaultBoard: Board = {
    id: randomUUID(),
    organizationId: "org-1",
    name: "Sample Board",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { ...defaultBoard, ...overrides };
};

// this used for randomized tests, e.g. for property-based testing
export const makeRandomBoard = (overrides?: Partial<Board>): Board => {
  const randomBoard: Board = {
    id: crypto.randomUUID(),
    organizationId: faker.string.uuid(),
    name: `Board ${Math.floor(Math.random() * 1000)}`,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
  return { ...randomBoard, ...overrides };
};
