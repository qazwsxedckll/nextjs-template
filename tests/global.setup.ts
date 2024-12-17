import prisma from "@/lib/db/db";
import { test as setup } from "@playwright/test";

setup("reset db", async ({}) => {
  await prisma.$transaction([
    prisma.session.deleteMany(),
    prisma.emailVerificationRequest.deleteMany(),
    prisma.passwordResetSession.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});
