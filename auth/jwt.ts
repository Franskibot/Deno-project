import { create, getNumericDate, verify } from "@zaubrik/djwt";
import { PersonalDetail } from "../types/inferred.ts";

const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);

const generateJwt = async (payload: PersonalDetail | undefined, origin: string) => {
  if (!payload) return payload;
  const nbf = new Date();
  nbf.setDate(nbf.getDate() + 365);
  const jwt = await create(
    { alg: "HS512", type: "JWT" },
    { exp: getNumericDate(nbf), aud: origin, email: payload.email },
    key
  );
  return { jwt, nbf };
};

const verifyJwt = async (jwt: string) => {
  const payload = await verify(jwt, key);
  return payload;
};

export { generateJwt, verifyJwt };