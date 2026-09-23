import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { Product } from "../../../src/domain/product.entity";

// for determenistic tests, e.g. for unit tests
export const makeProduct = (overrides: Partial<Product>): Product => {
  const defaultProduct: Product = {
    id: randomUUID(),
    boardId: randomUUID(),
    name: "Product Name", // max length constraint
    skuName: "SKU12345", // max length constraint
    description: "string of a description .....", // Optional- max length constraint 2010
    currentStage: "draft",
    active_3d_model_url: null, // Nullable - must be valid URL
    targetBudget: 44.06, // Optional- non-negative decimal
    ownerId: randomUUID(),
    //version: 4.1, // Optional - version for concurrency control
    archivedAt: null, // Nullable timestamp for soft delete/archive
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return { ...defaultProduct, ...overrides } as Product;
};

// For randomized tests,,,
export const makeRandomProduct = (overrides?: Partial<Product>): Product => {
  //const productStage = faker.helpers.arrayElement(PRODUCT_STAGES);
  const randomProduct: Product = {
    id: faker.string.uuid(),
    boardId: faker.string.uuid(),
    name: `Product ${Math.floor(Math.random() * 1000)}`,
    skuName: `SKU${Math.floor(Math.random() * 1000)}`,
    description: faker.lorem.paragraph().slice(0, 2010),
    currentStage: faker.helpers.arrayElement([
      "draft",
      "concept",
      "detailed-design",
      "internal-review",
      "floor-feedback",
      "revision",
      "design-released",
    ]),
    active_3d_model_url: faker.internet.url(),
    targetBudget: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
    ownerId: faker.string.uuid(),
    version: faker.number.float({ min: 0, max: 10 }),
    archivedAt: faker.date.past(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
  return { ...randomProduct, ...overrides } as Product;
};
