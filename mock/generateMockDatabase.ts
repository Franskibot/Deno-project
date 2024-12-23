import { create_people_table_command } from "./database/personal-details.db.ts";
import { create_animal_table_command } from "./database/animal.db.ts";
import { factoryAnimals, factoryPeople } from "./factory.ts";
import { bcryptHasher } from "../auth/pwd.ts";
import { encode } from "https://deno.land/std@0.152.0/encoding/base64.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const generateMockAnimalDataForDb = (db: DB) => {
  factoryAnimals.forEach((animal) => {
    const stmt = db.prepareQuery(
      "INSERT INTO pets(id, owner, animal) VALUES (?, ?, ?);",
    );
    stmt.execute([
      animal.id,
      animal.owner,
      animal.animal,
    ]);
  });
};

const generateMockPersonalDataForDb = async (db: DB) => {
  for (const person of factoryPeople) {
    const randSalt = crypto.getRandomValues(new Uint8Array(32));
    const salt = encode(randSalt);
    const hashedPassword = await bcryptHasher(person.password);
    console.log(`Generated hash for ${person.email}: ${hashedPassword}`);
    const stmt = db.prepareQuery(
      "INSERT INTO people(id, firstName, lastName, email, password, salt) VALUES (?, ?, ?, ?, ?, ?);",
    );
    stmt.execute([
      person.id,
      person.firstName,
      person.lastName,
      person.email,
      hashedPassword,
      salt,
    ]);
  }
};

export const generateMockDataForDb = async (
  personalDetailsMockDbPath: string,
  animalMockDbPath: string,
) => {
  try {
    Deno.removeSync(personalDetailsMockDbPath);
    Deno.removeSync(animalMockDbPath);
  } catch (_err) {
    // Ignore errors if files do not exist
  }
  const personalDetailsMockDb = new DB(personalDetailsMockDbPath);
  const animalMockDb = new DB(animalMockDbPath);

  personalDetailsMockDb.execute(create_people_table_command);
  await generateMockPersonalDataForDb(personalDetailsMockDb);

  animalMockDb.execute(create_animal_table_command);
  generateMockAnimalDataForDb(animalMockDb);
  return {
    personalDetailsMockDb,
    animalMockDb,
  };
};