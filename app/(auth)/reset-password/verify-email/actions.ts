"use server";

import {
  setPasswordResetSessionAsEmailVerified,
  validateAndDeletePasswordResetSession,
} from "@/lib/auth/password-reset";
import { setUserAsEmailVerifiedIfEmailMatches } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  code: z.string().trim(),
});

export async function verifyPasswordResetEmailAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { session } = await validateAndDeletePasswordResetSession();
  if (!session) {
    return {
      message: "Not authenticated",
    };
  }
  if (session.emailVerified) {
    return {
      message: "Forbidden",
    };
  }

  const validatedFields = formSchema.safeParse({
    code: formData.get("code"),
  });

  if (!validatedFields.success) {
    return {
      message: "Please enter your code",
    };
  }

  const { code } = validatedFields.data;

  if (code !== session.code) {
    return {
      message: "Incorrect code",
    };
  }
  setPasswordResetSessionAsEmailVerified(session.id);
  const emailMatches = setUserAsEmailVerifiedIfEmailMatches(
    session.userId,
    session.email
  );
  if (!emailMatches) {
    return {
      message: "Please restart the process",
    };
  }
  return redirect("/reset-password");
}

interface ActionResult {
  message: string;
}
