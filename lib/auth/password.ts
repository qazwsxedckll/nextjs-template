import { hash, verify } from "@node-rs/argon2";
import { z } from "zod";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyPasswordHash(
  hash: string,
  password: string
): Promise<boolean> {
  return await verify(hash, password);
}

export const passwordSchema = z
  .string()
  .min(8, { message: "Be at least 8 characters long" })
  .max(256, { message: "Be at most 256 characters long" })
  .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
  .regex(/[0-9]/, { message: "Contain at least one number." })
  // .regex(/[^a-zA-Z0-9]/, {
  //   message: "Contain at least one special character.",
  // })
  .trim();
