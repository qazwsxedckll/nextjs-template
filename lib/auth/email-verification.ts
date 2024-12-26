import { env } from "@/env.js";
import { generateRandomOTP } from "@/lib/auth/utils";
import { cookies } from "next/headers";
import prisma from "../db/db";
import { getCurrentSessionWithoutRedirect } from "./session";

export async function getUserEmailVerificationRequest(
  userId: string,
  id: string
): Promise<EmailVerificationRequest | null> {
  const row = await prisma.emailVerificationRequest.findUnique({
    where: {
      id,
      userId,
    },
  });
  if (!row) {
    return null;
  }
  const request: EmailVerificationRequest = {
    id: row.id,
    userId: row.userId,
    code: row.code,
    email: row.email,
    expiresAt: row.expiresAt,
  };
  return request;
}

export async function createEmailVerificationRequest(
  userId: string,
  email: string
): Promise<EmailVerificationRequest> {
  deleteUserEmailVerificationRequest(userId);
  const code = generateRandomOTP();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
  const row = await prisma.emailVerificationRequest.create({
    data: {
      userId,
      code,
      email,
      expiresAt,
    },
  });
  console.log(`Verification code for ${email}: ${code}`);

  const request: EmailVerificationRequest = {
    id: row.id,
    userId,
    code,
    email,
    expiresAt,
  };
  return request;
}

export async function deleteUserEmailVerificationRequest(userId: string) {
  await prisma.emailVerificationRequest.deleteMany({
    where: {
      userId,
    },
  });
}

export function sendVerificationEmail(email: string, code: string): void {
  console.log(`To ${email}: Your verification code is ${code}`);
}

export async function setEmailVerificationRequestCookie(
  request: EmailVerificationRequest
) {
  (await cookies()).set("email_verification", request.id, {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: request.expiresAt,
  });
}

export async function deleteEmailVerificationRequestCookie() {
  (await cookies()).set("email_verification", "", {
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
  });
}

export async function getUserEmailVerificationRequestFromRequest() {
  const { user } = await getCurrentSessionWithoutRedirect();
  if (!user) {
    return null;
  }
  const id = (await cookies()).get("email_verification")?.value ?? null;
  if (!id) {
    return null;
  }
  const request = getUserEmailVerificationRequest(user.id, id);
  if (!request) {
    deleteEmailVerificationRequestCookie();
  }
  return request;
}

export interface EmailVerificationRequest {
  id: string;
  userId: string;
  code: string;
  email: string;
  expiresAt: Date;
}
