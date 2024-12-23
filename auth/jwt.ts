// filepath: /c:/Users/frata/Desktop/Deno-project/auth/jwt.ts
import { create, verify, getNumericDate } from "@zaubrik/djwt";

const jwtSecret = "your_secret_key_here"; // Imposta la chiave direttamente nel codice

const key = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(jwtSecret),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);

export const generateJwt = async (payload: { id: string; firstName: string; lastName: string; email: string }) => {
  const jwt = await create({ alg: "HS512", typ: "JWT" }, { ...payload, exp: getNumericDate(60 * 60) }, key);
  return jwt;
};

export const verifyJwt = async (token: string) => {
  const payload = await verify(token, key);
  return payload;
};