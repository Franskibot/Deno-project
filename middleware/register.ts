import { Context } from "https://deno.land/x/hono@v3.2.7/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v3.2.7/http-exception.ts";
import { bcryptHasher } from "../auth/pwd.ts";
import { personalDetailsDb } from "../mock/database/mod.ts";
import { PersonalDetailWithSalt } from "../types/common.ts";
import { encode } from "https://deno.land/std@0.152.0/encoding/base64.ts";

const registerUser = async (c: Context) => {
  const userInput = await c.req.json<{ firstName: string; lastName: string; email: string; password: string }>();
  const rows = personalDetailsDb.query<[PersonalDetailWithSalt]>("SELECT * FROM people WHERE email = ?", [userInput.email]);
  const row = rows[0];
  if (row) {
    throw new HTTPException(404, { message: "User already exists." });
  }
  const randSalt = crypto.getRandomValues(new Uint8Array(32));
  const salt = encode(randSalt);
  const hashedPassword = await bcryptHasher(userInput.password);
  personalDetailsDb.query("INSERT INTO people(firstName, lastName, email, password, salt) VALUES (?, ?, ?, ?, ?)", [userInput.firstName, userInput.lastName, userInput.email, hashedPassword, salt]);
  const insertedRow = personalDetailsDb.query<[PersonalDetailWithSalt]>("SELECT * FROM people WHERE email = ?", [userInput.email]);
  if (insertedRow.length > 0) {
    return c.json(userInput);
  }
  throw new HTTPException(503, { message: "Server error." });
};

export default registerUser;