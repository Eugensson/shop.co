import { prisma } from "@/prisma/prisma";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    return await prisma.twoFactorConfirmation.findUnique({ where: { userId } });
  } catch (error) {
    console.error("Error fetching two-factor confirmation:", error);
    return null;
  }
};
