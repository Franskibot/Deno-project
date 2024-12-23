import { Context } from "https://deno.land/x/hono@v3.2.7/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v3.2.7/http-exception.ts";
import { bcryptVerify } from "../auth/pwd.ts";
import { personalDetailsDb } from "../mock/database/mod.ts";
import { PersonalDetail } from "../types/inferred.ts";
import { PersonalDetailWithSalt } from "../types/common.ts";
import { generateJwt } from "../auth/jwt.ts";
import { setCookie } from "https://deno.land/x/hono@v3.2.7/middleware/cookie/index.ts";

const loginUser = async (c: Context) => {
  const userInput = await c.req.json<{ email: string; password: string }>();
  const stmt1 = personalDetailsDb.prepareQuery("SELECT * FROM people WHERE email = ?");
  const row = stmt1.one([userInput.email]) as unknown as PersonalDetailWithSalt;
  if (!row) {
    throw new HTTPException(404, { message: "User does not exist." });
  }
  const verified = await bcryptVerify(userInput.password, row.password);
  if (verified) {
    const personalDetail: PersonalDetail = {
      id: row.id,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      password: userInput.password,
    };
    const jwt = await generateJwt(personalDetail);
    if (!jwt) {
      throw new HTTPException(503, { message: "Server Error." });
    }
    setCookie(c, "jwt", jwt, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      secure: false,
      sameSite: "Lax",
      path: "/",
      httpOnly: true,
    });
    return c.text("User has logged in");
  }
  throw new HTTPException(403, { message: "Invalid credentials." });
};

export default loginUser;