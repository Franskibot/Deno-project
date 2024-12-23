import { Hono } from "https://deno.land/x/hono@v3.0.0/mod.ts";
import { generateJwt, verifyJwt } from "./auth/jwt.ts";
import { argon2Hasher, argon2Verify } from "./auth/pwd.ts";
import { personalDetailsDb } from "./mock/database/mod.ts"; // Assicurati che il percorso sia corretto

const app = new Hono();

// Rotta per la registrazione
app.post('/register', async (c) => {
    const { firstName, lastName, email, password } = await c.req.json();

    // Genera un sale casuale per la password
    const salt = crypto.getRandomValues(new Uint8Array(32));
    const hashedPassword = await argon2Hasher(password, new TextDecoder().decode(salt));

    // Inserisci i dettagli dell'utente nel database
    await personalDetailsDb.query(
        "INSERT INTO people (firstName, lastName, email, password, salt) VALUES (?, ?, ?, ?, ?);",
        [firstName, lastName, email, hashedPassword, new TextDecoder().decode(salt)]
    );

    return c.json({ message: "User registered successfully!" }, 201);
});

// Rotta per il login
app.post('/login', async (c) => {
    const { email, password } = await c.req.json();

    // Recupera l'utente dal database
    const result = await personalDetailsDb.query(
        "SELECT * FROM people WHERE email = ?;",
        [email]
    );

    interface User {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        salt: string;
    }

    const user = result[0] as unknown as User;

    if (!user || !await argon2Verify(password, user.salt, user.password)) {
        return c.json({ message: "Invalid credentials" }, 401);
    }

    // Genera un JWT per l'utente
    const jwt = await generateJwt({ id: user.id.toString(), firstName: user.firstName, lastName: user.lastName, email: user.email }, c.req.url);
    return c.json({ jwt });
});

// Rotta per ottenere i dettagli dell'utente autenticato
app.get('/me', async (c) => {
    const authHeader = c.req.headers.get('Authorization');
    
    if (!authHeader) {
        return c.json({ message: "Authorization header missing" }, 401);
    }

    const token = authHeader.split(' ')[1];
    
    try {
        const payload = await verifyJwt(token);
        return c.json({ email: payload.email });
    } catch {
        return c.json({ message: "Invalid token" }, 403);
    }
});

// Esportazione dell'applicazione Hono
export default app;
