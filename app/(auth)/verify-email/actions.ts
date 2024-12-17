"use server";

import {
  createEmailVerificationRequest,
  deleteEmailVerificationRequestCookie,
  deleteUserEmailVerificationRequest,
  getUserEmailVerificationRequestFromRequest,
  sendVerificationEmail,
  setEmailVerificationRequestCookie,
} from "@/lib/auth/email-verification";
import { invalidateUserPasswordResetSessions } from "@/lib/auth/password-reset";
import { getCurrentSessionWithoutRedirect } from "@/lib/auth/session";
import { updateUserEmailAndSetEmailAsVerified } from "@/lib/auth/user";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  code: z.string().trim(),
});

export async function verifyEmailAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { session, user } = await getCurrentSessionWithoutRedirect();
  if (!session) {
    return {
      message: "Not authenticated",
    };
  }

  let verificationRequest = await getUserEmailVerificationRequestFromRequest();
  if (!verificationRequest) {
    return {
      message: "Not authenticated",
    };
  }
  const validatedFields = formSchema.safeParse({
    code: formData.get("code"),
  });
  if (!validatedFields.success) {
    return {
      message: "Enter your code",
    };
  }
  const { code } = validatedFields.data;
  if (Date.now() >= verificationRequest.expiresAt.getTime()) {
    verificationRequest = await createEmailVerificationRequest(
      verificationRequest.userId,
      verificationRequest.email
    );
    sendVerificationEmail(verificationRequest.email, verificationRequest.code);
    return {
      message:
        "The verification code was expired. We sent another code to your inbox.",
    };
  }
  if (verificationRequest.code !== code) {
    return {
      message: "Incorrect code.",
    };
  }
  deleteUserEmailVerificationRequest(user.id);
  invalidateUserPasswordResetSessions(user.id);
  updateUserEmailAndSetEmailAsVerified(user.id, verificationRequest.email);
  deleteEmailVerificationRequestCookie();
  return redirect("/");
}

export async function resendEmailVerificationCodeAction(): Promise<ActionResult> {
  const { session, user } = await getCurrentSessionWithoutRedirect();
  if (!session) {
    return {
      message: "Not authenticated",
    };
  }
  let verificationRequest = await getUserEmailVerificationRequestFromRequest();
  if (!verificationRequest) {
    if (user.emailVerified) {
      return {
        message: "Forbidden",
      };
    }
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      user.email
    );
  } else {
    verificationRequest = await createEmailVerificationRequest(
      user.id,
      verificationRequest.email
    );
  }
  sendVerificationEmail(verificationRequest.email, verificationRequest.code);
  setEmailVerificationRequestCookie(verificationRequest);
  return {
    message: "A new code was sent to your inbox.",
  };
}

interface ActionResult {
  message: string;
}
