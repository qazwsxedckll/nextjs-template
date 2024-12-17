"use server";

import { passwordSchema } from "@/lib/auth/password";
import {
  deletePasswordResetSessionTokenCookie,
  invalidateUserPasswordResetSessions,
  validateAndDeletePasswordResetSession,
} from "@/lib/auth/password-reset";
import {
  createSession,
  generateSessionToken,
  invalidateUserSessions,
  setSessionTokenCookie,
} from "@/lib/auth/session";
import { updateUserPassword } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  password: passwordSchema,
});

export async function resetPasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { session: passwordResetSession, user } =
    await validateAndDeletePasswordResetSession();
  if (passwordResetSession === null) {
    return {
      message: "Not authenticated",
    };
  }
  if (!passwordResetSession.emailVerified) {
    return {
      message: "Forbidden",
    };
  }

  const validatedFields = formSchema.safeParse({
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.password,
    };
  }

  const { password } = validatedFields.data;

  invalidateUserPasswordResetSessions(passwordResetSession.userId);
  invalidateUserSessions(passwordResetSession.userId);
  await updateUserPassword(passwordResetSession.userId, password);

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  deletePasswordResetSessionTokenCookie();
  return redirect("/");
}

interface ActionResult {
  message: string | string[] | undefined;
}
