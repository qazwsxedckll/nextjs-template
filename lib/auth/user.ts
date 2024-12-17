import { encodeBase32UpperCaseNoPadding } from "@oslojs/encoding";
import prisma from "../db/db";
import { hashPassword } from "./password";

export interface User {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
}

export function generateRandomRecoveryCode(): string {
  const recoveryCodeBytes = new Uint8Array(10);
  crypto.getRandomValues(recoveryCodeBytes);
  const recoveryCode = encodeBase32UpperCaseNoPadding(recoveryCodeBytes);
  return recoveryCode;
}

export async function createUser(
  email: string,
  username: string,
  password: string
): Promise<User> {
  const passwordHash = await hashPassword(password);
  const row = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
  });
  const user: User = {
    id: row.id,
    username: row.username,
    email: row.email,
    emailVerified: false,
  };
  return user;
}

export async function updateUserEmailAndSetEmailAsVerified(
  userId: string,
  email: string
) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      email,
      emailVerified: true,
    },
  });
}

export async function getUserFromEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    emailVerified: user.emailVerified,
  };
}

export async function getUserPasswordHash(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return "";
  }
  return user.passwordHash;
}

export async function setUserAsEmailVerifiedIfEmailMatches(
  userId: string,
  email: string
): Promise<boolean> {
  const result = await prisma.user.update({
    where: {
      id: userId,
      email,
    },
    data: {
      emailVerified: true,
    },
  });

  return email === result.email;
}

export async function updateUserPassword(
  userId: string,
  password: string
): Promise<void> {
  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash,
    },
  });
}
