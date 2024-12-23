import { encode, decode } from "https://deno.land/std@0.152.0/encoding/base64.ts"; // Importa encode e decode
import * as _argon2 from "https://deno.land/x/argon2@v0.9.2/lib/mod.ts"; 
import { config } from "https://deno.land/x/dotenv/mod.ts"; // Importa dotenv

// Carica le variabili d'ambiente
const env = config();
const TOKEN = decode(env.API_KEY ?? ""); // Usa decode per decodificare la chiave API
const encoder = new TextEncoder();

export const argon2Verify = (password: string, salt: string, originalHash: string): boolean => {
    const encodedPassword = encoder.encode(password);
    const encodedSalt = encoder.encode(salt);
    const params: Argon2Params = {
        algorithm: "Argon2id",
        secret: TOKEN,
        version: 0x13,
    };
    return encode(hash(encodedPassword, encodedSalt, params)) === originalHash; // Usa encode per confrontare l'hash
};

export const argon2Hasher = async (password: string, salt: string): Promise<string> => {
    const encodedPassword = encoder.encode(password);
    const encodedSalt = encoder.encode(salt);
    const params: Argon2Params = {
        algorithm: "Argon2id",
        secret: TOKEN,
        version: 0x13,
    };
    return await hash(encodedPassword, encodedSalt, params); // Restituisce l'hash
};
