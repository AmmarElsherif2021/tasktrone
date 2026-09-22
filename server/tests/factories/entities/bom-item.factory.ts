import { randomUUID } from "crypto";
import { BomItem } from "../../../src/domain/bom-item.entity";
import { faker } from "@faker-js/faker";

// This used for fixed and deterministic defaults
export const createBOMItem = (overrides: Partial<BomItem>): BomItem => {
  const default_BOM_Item: BomItem = {
    id: randomUUID(),
    productId: randomUUID(),
    partNumber: `PN-${Math.floor(Math.random() * 10000)}`,
    name: `Component ${Math.floor(Math.random() * 1000)}`,
    quantity: 60,
    unitCost: 55.5,
    totalPrice: 60 * 55.5, // quantity * unitCost
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { ...default_BOM_Item, ...overrides };
};

export const createRandomBOMItem = (overrides: Partial<BomItem>): BomItem => {
  const randomQuantity = faker.number.int({ min: 1, max: 1000 });
  const randomUnitCost = faker.number.float({
    min: 1,
    max: 1000,
  });
  const calculatedRandomTotal = randomQuantity * randomUnitCost;
  const randomBOMItem: BomItem = {
    id: randomUUID(),
    productId: randomUUID(),
    partNumber: `PN-${Math.floor(Math.random() * 10000)}`,
    name: `Component ${Math.floor(Math.random() * 1000)}`,
    quantity: calculatedRandomTotal,
    unitCost: 55.5,
    totalPrice: randomQuantity * randomUnitCost,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return { ...randomBOMItem, ...overrides };
};
