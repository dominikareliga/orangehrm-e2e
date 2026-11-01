import { randomUUID } from "node:crypto";

export type NewEmployee = {
  firstName: string;
  lastName: string;
  employeeId: string;
};

// A unique employee per test. The app caps the id at 10 characters.
export function buildEmployee(): NewEmployee {
  const id = randomUUID().slice(0, 8);
  return {
    firstName: "Test",
    lastName: `Employee ${id}`,
    employeeId: id,
  };
}
