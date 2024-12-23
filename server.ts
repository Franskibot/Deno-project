import { Hono } from "https://deno.land/x/hono@v3.2.7/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v3.2.7/http-exception.ts";
import { factoryPeople } from "./mock/factory.ts";
import { animalDb, personalDetailsDb } from "./mock/database/mod.ts";
import { create_animal_table_command } from "./mock/database/animal.db.ts";
import { create_people_table_command } from "./mock/database/personal-details.db.ts";
import { Animal } from "./types/inferred.ts";
import checkAuth from "./auth/checkAuth.ts";
import registerUser from "./middleware/register.ts";
import loginUser from "./middleware/login.ts";
import { PersonalDetailWithSalt } from "./types/common.ts";

// Verifica che i database siano aperti prima di eseguire le query
try {
  if (!animalDb) {
    throw new Error("Database animali non aperto");
  }
  animalDb.query(create_animal_table_command);

  if (!personalDetailsDb) {
    throw new Error("Database persone non aperto");
  }
  personalDetailsDb.query(create_people_table_command);
} catch (error) {
  console.error("Errore nell'inizializzazione del database:", error);
  Deno.exit(1);
}

type Env = {
  Variables: {};
};

const admin = new Hono<Env>();
const animals = new Hono<Env>();
const people = new Hono<Env>();
const app = new Hono<Env>();

// Configurazione dei percorsi base
app.route("/auth/admin", admin);
app.route("/api/animals", animals);
app.route("/api/people", people);

// Rotte di autenticazione
admin.post("/register", registerUser);
admin.post("/login", loginUser);

// Middleware di autenticazione
animals.use(checkAuth);
people.use(checkAuth);

// Rotte per gli animali
animals.get("/", (c) => {
  try {
    const rows = animalDb.query<[Animal]>("SELECT * FROM pets;");
    return c.json(rows);
  } catch (error) {
    throw new HTTPException(500, {
      message: "Errore nel recupero dei dati degli animali",
    });
  }
});