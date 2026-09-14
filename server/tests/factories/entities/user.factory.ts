import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { User } from "src/domain/user.entity";

//For fixed and deterministic defaults
export const makeUser = (overrides?: Partial<User>): User => {
  const defaultUser: User = {
<<<<<<< HEAD
    id: "1",
=======
    id: randomUUID(),
>>>>>>> e1a6194 (new file:   .github/ISSUE_TEMPLATE/task.yml)
    organizationId: "org-1",
    email: "john.doe@example.com",
    displayName: "John Doe",
    role: "admin",
    createdAt: new Date(),
  };
  return { ...defaultUser, ...overrides };
};

// For randomized tests, e.g. for property-based testing
export const createRandomUser = (overrides?: Partial<User>): User => {
  const defaultUser: User = {
    id: faker.string.uuid(),
    organizationId: faker.string.uuid(),
    email: faker.internet.email(),
    displayName: faker.person.fullName(),
    role: faker.helpers.arrayElement([
      "admin",
      "member",
      "viewer",
    ]) as User["role"],
    createdAt: faker.date.past(),
  };
  return { ...defaultUser, ...overrides };
};
