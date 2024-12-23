import { bcryptVerify } from "../auth/pwd.ts";
import { generateMockDataForDb } from "./generateMockDatabase.ts";
import { factoryPeople } from "./factory.ts";
import { assert } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { PersonalDetailWithSalt } from "../types/common.ts";

Deno.test("All password hashes are verified with their respective salt.", async () => {
  const personalDetailsMockDbPath = "./mock/database/people-mock.db";
  const animalMockDbPath = "./mock/database/pets-mock.db";
  const { personalDetailsMockDb } = await generateMockDataForDb(
    personalDetailsMockDbPath,
    animalMockDbPath,
  );
  for (const person of factoryPeople) {
    const [row] = personalDetailsMockDb.query<[PersonalDetailWithSalt]>(
      `SELECT * FROM people WHERE email = ?;`,
      [person.email]
    );
    assert(row !== undefined);
    console.log(`Testing password for user: ${person.email}`);
    console.log(`Original password: ${person.password}`);
    console.log(`Stored hash: ${row[0].password}`);
    const passwordMatch = await bcryptVerify(person.password, row[0].password);
    console.log(`Password match: ${passwordMatch}`);
    assert(passwordMatch);
  }
});