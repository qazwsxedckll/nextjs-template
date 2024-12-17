"use server";

import {
  createPasswordResetSession,
  invalidateUserPasswordResetSessions,
  sendPasswordResetEmail,
  setPasswordResetSessionTokenCookie,
} from "@/lib/auth/password-reset";
import { generateSessionToken } from "@/lib/auth/session";
import { getUserFromEmail } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function forgotPasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const validatedFields = formSchema.safeParse({
    email: formData.get("email"),
  });
  if (!validatedFields.success) {
    return {
      message: "Please enter a valid email address",
    };
  }

  const { email } = validatedFields.data;

  const user = await getUserFromEmail(email);
  if (!user) {
    return {
      message:
        "A link to reset your password has been emailed to the address provided.",
    };
  }
  await invalidateUserPasswordResetSessions(user.id);
  const sessionToken = generateSessionToken();
  const session = await createPasswordResetSession(
    sessionToken,
    user.id,
    user.email
  );

  sendPasswordResetEmail(session.email, session.code);
  await setPasswordResetSessionTokenCookie(sessionToken, session.expiresAt);
  return redirect("/reset-password/verify-email");
}

interface ActionResult {
  message: string;
}

const formSchema = z.object({
  email: z.string().email().trim(),
});
