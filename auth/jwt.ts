import { create, verify, getNumericDate } from "@zaubrik/djwt";
import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = config();
const jwtSecret = env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

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