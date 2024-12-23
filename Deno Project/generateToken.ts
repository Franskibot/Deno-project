import { crypto } from "https://deno.land/std@0.152.0/crypto/mod.ts";
import { encode } from "https://deno.land/std@0.152.0/encoding/base64.ts";

const apiKey = crypto.getRandomValues(new Uint8Array(16));
console.log(`GENERATED API_KEY: \`${encode(apiKey)}\``);