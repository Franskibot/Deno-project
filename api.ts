import { Hono } from "https://deno.land/x/hono@v3.0.0/mod.ts";
import { generateJwt, verifyJwt } from "./auth/jwt.ts";
import { bcryptHasher, bcryptVerify } from "./auth/pwd.ts";
import { personalDetailsDb } from "./mock/database/mod.ts";
import type { Context } from "https://deno.land/x/hono@v3.0.0/mod.ts";

const app = new Hono();

// Rotta per la root
app.get('/', (c: Context) => {
    console.log('Root route accessed');
    return c.json({ message: "Welcome to the API!" });
});

// Rotta per la registrazione
app.post('/register', async (c: Context) => {
    console.log('Register route accessed');
    try {
        const { firstName, lastName, email, password } = await c.req.json();
        console.log('Request data:', { firstName, lastName, email, password });

        // Genera un hash per la password
        const hashedPassword = await bcryptHasher(password);
        console.log('Hashed password:', hashedPassword);

        // Inserisci i dettagli dell'utente nel database
        await personalDetailsDb.query(
            "INSERT INTO people (firstName, lastName, email, password, salt) VALUES (?, ?, ?, ?, ?);",
            [firstName, lastName, email, hashedPassword, "random_salt"]
        );
        console.log('User inserted into database');

        return c.json({ message: "User registered successfully!" }, 201);
    } catch (error) {
        console.error('Error in /register route:', error);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});

// Rotta per il login
app.post('/login', async (c: Context) => {
    console.log('Login route accessed');
    try {
        const { email, password } = await c.req.json();
        console.log('Request data:', { email, password });

        // Recupera l'utente dal database
        const result = await personalDetailsDb.query(
            "SELECT * FROM people WHERE email = ?;",
            [email]
        );
        console.log('Database query result:', result);

        interface User {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            salt: string;
        }

        const userArray = result[0] as unknown as [number, string, string, string, string, string];
        const user: User = {
            id: userArray[0],
            firstName: userArray[1],
            lastName: userArray[2],
            email: userArray[3],
            password: userArray[4],
            salt: userArray[5],
        };
        console.log('User data:', user);

        if (!user) {
            console.log('User not found');
            return c.json({ message: "Invalid credentials" }, 401);
        }

        const passwordMatch = await bcryptVerify(password, user.password);
        console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            console.log('Invalid credentials');
            return c.json({ message: "Invalid credentials" }, 401);
        }

        // Genera un JWT per l'utente
        const jwt = await generateJwt({ id: user.id.toString(), firstName: user.firstName, lastName: user.lastName, email: user.email });
        console.log('Generated JWT:', jwt);

        return c.json({ jwt });
    } catch (error) {
        console.error('Error in /login route:', error);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});

// Rotta per ottenere i dettagli dell'utente autenticato
app.get('/me', async (c: Context) => {
    console.log('Me route accessed');
    try {
        const authHeader = c.req.headers.get('Authorization');
        console.log('Authorization header:', authHeader);

        if (!authHeader) {
            return c.json({ message: "Authorization header missing" }, 401);
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token);

        try {
            const payload = await verifyJwt(token);
            console.log('JWT payload:', payload);
            return c.json({ email: payload.email });
        } catch (error) {
            console.error('Error verifying JWT:', error);
            return c.json({ message: "Invalid token" }, 403);
        }
    } catch (error) {
        console.error('Error in /me route:', error);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});

// Esportazione dell'applicazione Hono
export default app;