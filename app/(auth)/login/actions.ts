"use server";

import { verifyPasswordHash } from "@/lib/auth/password";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth/session";
import { getUserFromEmail, getUserPasswordHash } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import z from "zod";

type FormState =
  | {
      message?: string;
      errors?: {
        email?: string[];
        password?: string[];
      };
    }
  | undefined;

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Please enter a valid email.",
    })
    .trim(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await getUserFromEmail(email);
  if (!user) {
    return {
      message: "Invaild email or password",
    };
  } else {
    const passwordHash = await getUserPasswordHash(user.id);
    const validPassword = await verifyPasswordHash(passwordHash, password);
    if (!validPassword) {
      return {
        message: "Invaild email or password",
      };
    }
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);

  if (!user.emailVerified) {
    return redirect("/verify-email");
  }
  return redirect("/");
}
