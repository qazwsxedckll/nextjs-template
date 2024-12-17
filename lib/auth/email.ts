import prisma from "../db/db";

export async function checkEmailAvailability(email: string): Promise<boolean> {
  const count = await prisma.user.count({
    where: {
      email,
    },
  });

  return count === 0;
}
