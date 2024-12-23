import { DB } from "https://deno.land/x/sqlite/mod.ts";

const animalDb = new DB("./mock/database/pets.db");

export const create_animal_table_command = `
CREATE TABLE IF NOT EXISTS pets(
    id TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    animal TEXT NOT NULL
);
`;

export default animalDb;
