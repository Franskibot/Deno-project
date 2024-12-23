import { hash, compare } from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export const bcryptVerify = async (password: string, originalHash: string): Promise<boolean> => {
    return await compare(password, originalHash);
};

export const bcryptHasher = async (password: string): Promise<string> => {
    return await hash(password);
};