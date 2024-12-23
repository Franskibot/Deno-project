import { verifyJwt } from "./jwt.ts";
import { getCookie } from "https://deno.land/x/hono@v3.2.7/middleware/cookie/index.ts";
import type { Context, Next } from "https://deno.land/x/hono@v3.2.7/mod.ts";
import { HTTPException } from "https://deno.land/x/hono@v3.2.7/http-exception.ts";

const checkAuth = async (ctx: Context, next: Next) => {
  const method = ctx.req.method;
  if (method === "PUT" || method === "DELETE") {
    const jwtFromCookie = getCookie(ctx, "jwt");
    let jwtSignature: string = "";

    const authHeader = ctx.req.header("Authorization");
    if (!authHeader) {
      throw new HTTPException(403, {
        message: "You are not allowed to modify this resource.",
      });
    }
    const [, jwtSig] = authHeader.split(" ");
    if (!jwtSig.trim() || !jwtFromCookie) {
      throw new HTTPException(403, {
        message: "You are not allowed to modify this resource.",
      });
    }
    jwtSignature = jwtSig;
    if (jwtFromCookie === jwtSignature) {
      const jwtCookieValue = await verifyJwt(jwtFromCookie);
      const jwtAuthValue = await verifyJwt(jwtSig);
      const verified = jwtAuthValue.email === jwtCookieValue.email;
      if (!verified) {
        throw new HTTPException(403, {
          message: "You are not allowed to modify this resource.",
        });
      } else {
        return await next();
      }
    }
    throw new HTTPException(403, {
      message: "You are not allowed to modify this resource.",
    });
  }
  await next();
};

export default checkAuth;