// filepath: /c:/Users/frata/Desktop/Deno-project/mock/database/animal.db.ts
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

export const create_animal_table_command = `
CREATE TABLE IF NOT EXISTS pets(
    id TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    animal TEXT NOT NULL
);
`;

const animalDb = new DB("./mock/database/pets.db");
animalDb.execute(create_animal_table_command);

export default animalDb;