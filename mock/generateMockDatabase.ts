import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import { factoryPeople, factoryAnimals } from "./factory.ts";
import { create_people_table_command } from "./database/personal-details.db.ts";
import { create_animal_table_command } from "./database/animal.db.ts";

// Funzione per generare dati fittizi per il database degli animali
const generateMockAnimalDataForDb = (db: DB) => {
    factoryAnimals.forEach((animal) => {
        db.query(
            "INSERT INTO pets (id, owner, animal) VALUES (?, ?, ?);",
            [animal.id, animal.owner, animal.animal]
        );
    });
};

// Funzione per generare dati fittizi per il database dei dettagli personali
const generateMockPersonalDataForDb = (db: DB) => {
    factoryPeople.forEach((person) => {
        db.query(
            "INSERT INTO people (id, firstName, lastName, email, password, salt) VALUES (?, ?, ?, ?, ?, ?);",
            [person.id, person.firstName, person.lastName, person.email, person.password, "random_salt"]
        );
    });
};

// Funzione per generare dati fittizi per entrambi i database
export const generateMockDataForDb = (personalDetailsMockDbPath: string, animalMockDbPath: string) => {
    try {
        Deno.removeSync(personalDetailsMockDbPath);
        Deno.removeSync(animalMockDbPath);
    } catch (_err) {
        // Ignore error if file does not exist
    }

    const personalDetailsMockDb = new DB(personalDetailsMockDbPath);
    const animalMockDb = new DB(animalMockDbPath);

    personalDetailsMockDb.execute(create_people_table_command);
    generateMockPersonalDataForDb(personalDetailsMockDb);

    animalMockDb.execute(create_animal_table_command);
    generateMockAnimalDataForDb(animalMockDb);

    return { personalDetailsMockDb, animalMockDb };
};

// Percorsi dei database fittizi
const personalDetailsMockDbPath = "./mock/database/personalDetails.db";
const animalMockDbPath = "./mock/database/pets.db";

// Genera i dati fittizi per i database
generateMockDataForDb(personalDetailsMockDbPath, animalMockDbPath);