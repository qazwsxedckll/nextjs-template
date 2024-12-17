"use server";

import { checkEmailAvailability } from "@/lib/auth/email";
import {
  createEmailVerificationRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/lib/auth/email-verification";
import { passwordSchema } from "@/lib/auth/password";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/auth/session";
import { createUser } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters long." })
      .max(32, { message: "Username must be at most 32 characters long." })
      .trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

type FormState =
  | {
      errors?: {
        username?: string[];
        email?: string[];
        password?: string[];
        confirm?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signupAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;

  const emailAvailable = await checkEmailAvailability(email);
  if (!emailAvailable) {
    return {
      message: "Email is already in use.",
    };
  }

  const user = await createUser(email, username, password);
  const emailVerificationRequest = await createEmailVerificationRequest(
    user.id,
    user.email
  );
  sendVerificationEmail(
    emailVerificationRequest.email,
    emailVerificationRequest.code
  );
  setEmailVerificationRequestCookie(emailVerificationRequest);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  return redirect("/verify-email");
}
