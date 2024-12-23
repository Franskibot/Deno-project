import { encode, decode } from "https://deno.land/std@0.152.0/encoding/base64.ts";
import { hash, compare } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// Carica le variabili d'ambiente
const env = config();
const TOKEN = decode(env.API_KEY ?? "");
const encoder = new TextEncoder();

export const bcryptVerify = async (password: string, originalHash: string): Promise<boolean> => {
    return await compare(password, originalHash);
};

export const bcryptHasher = async (password: string): Promise<string> => {
    return await hash(password);
};