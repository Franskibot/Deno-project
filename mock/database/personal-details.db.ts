// filepath: /c:/Users/frata/Desktop/Deno-project/mock/database/personal-details.db.ts
import { DB } from "https://deno.land/x/sqlite/mod.ts";

export const create_people_table_command = `
CREATE TABLE IF NOT EXISTS people(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
);
`;

const personalDetailsDb = new DB("./mock/database/personalDetails.db");
personalDetailsDb.execute(create_people_table_command);

export default personalDetailsDb;