import { env } from "@/env.js";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { cookies } from "next/headers";
import prisma from "../db/db";
import { User } from "./user";
import { generateRandomOTP } from "./utils";

export async function createPasswordResetSession(
  token: string,
  userId: string,
  email: string
): Promise<PasswordResetSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: PasswordResetSession = {
    id: sessionId,
    userId,
    email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 10),
    code: generateRandomOTP(),
    emailVerified: false,
  };
  await prisma.passwordResetSession.create({
    data: {
      id: session.id,
      userId: session.userId,
      email: session.email,
      code: session.code,
      expiresAt: session.expiresAt,
    },
  });
  console.log(session);
  return session;
}

export async function validatePasswordResetSessionToken(
  token: string
): Promise<PasswordResetSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  console.log(sessionId);
  const row = await prisma.passwordResetSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });
  if (!row) {
    return { session: null, user: null };
  }
  const session: PasswordResetSession = {
    id: row.id,
    userId: row.userId,
    email: row.email,
    code: row.code,
    expiresAt: row.expiresAt,
    emailVerified: row.emailVerified,
  };
  const user: User = {
    id: row.user.id,
    email: row.user.email,
    username: row.user.username,
    emailVerified: row.user.emailVerified,
  };
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.passwordResetSession.delete({
      where: {
        id: session.id,
      },
    });
    return { session: null, user: null };
  }
  return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(
  sessionId: string
): Promise<void> {
  await prisma.passwordResetSession.update({
    where: {
      id: sessionId,
    },
    data: {
      emailVerified: true,
    },
  });
}

export async function invalidateUserPasswordResetSessions(userId: string) {
  await prisma.passwordResetSession.deleteMany({
    where: {
      userId,
    },
  });
}

export async function validatePasswordResetSession(): Promise<PasswordResetSessionValidationResult> {
  const token = (await cookies()).get("password_reset_session")?.value ?? null;
  console.log("get token: ", token);
  if (!token) {
    return { session: null, user: null };
  }
  const result = await validatePasswordResetSessionToken(token);
  return result;
}

export async function validateAndDeletePasswordResetSession(): Promise<PasswordResetSessionValidationResult> {
  const result = await validatePasswordResetSession();
  if (!result.session) {
    deletePasswordResetSessionTokenCookie();
  }
  return result;
}

export async function setPasswordResetSessionTokenCookie(
  token: string,
  expiresAt: Date
) {
  console.log("set token: ", token);
  (await cookies()).set("password_reset_session", token, {
    expires: expiresAt,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
  });
}

export async function deletePasswordResetSessionTokenCookie(): Promise<void> {
  (await cookies()).set("password_reset_session", "", {
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: env.NODE_ENV === "production",
  });
}

export function sendPasswordResetEmail(email: string, code: string): void {
  console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
  id: string;
  userId: string;
  email: string;
  expiresAt: Date;
  code: string;
  emailVerified: boolean;
}

export type PasswordResetSessionValidationResult =
  | { session: PasswordResetSession; user: User }
  | { session: null; user: null };
