"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { getUserByEmail, getUserById } from "@/data/user";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  editProfileSchema,
  loginSchema,
  newPasswordSchema,
  registerSchema,
  resetSchema,
} from "@/schemas";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getVerificationTokenByToken } from "@/data/verification-token";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokensEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { handleUnknownError } from "@/lib/utils";

export const register = async (values: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { name, email, password } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    if (!existingUser.isActive) {
      return {
        error:
          "Your account has been deactivated. Please contact the administrator.",
      };
    }

    return { error: "Email already exists" };
  }

  const verificationToken = await generateVerificationToken(email);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation sent by email" };
};

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email address not found!" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};

export const login = async (
  values: z.infer<typeof loginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = loginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid email or password" };
  }

  if (!existingUser.isActive) {
    return {
      error:
        "Your account has been deactivated. Please contact the administrator.",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Недійсний код!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Недійсний код!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Термін дії коду закінчився!" };
      }

      await prisma.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokensEmail(
        twoFactorToken.email,
        twoFactorToken.token
      );

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });

    return { success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Somethig went wrong! Please try again." };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut();
};

export const reset = async (values: z.infer<typeof resetSchema>) => {
  const validatedFields = resetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email address!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email address not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Confirmation sent by email!" };
};

export const newPassword = async (
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email address not found!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated!" };
};

export const softDeleteUser = async (userId: string) => {
  try {
    const user = await currentUser();

    if (!user || user.role !== UserRole.ADMIN) {
      return { error: "Insufficient rights to deactivate user account." };
    }

    if (user.id === userId) {
      return { error: "You cannot deactivate yourself account." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    revalidatePath("/users");
    return { success: "User account deactivated." };
  } catch (error) {
    return handleUnknownError(error);
  }
};

export const restoreUser = async (userId: string) => {
  try {
    const user = await currentUser();

    if (!user || user.role !== UserRole.ADMIN) {
      return { error: "Insufficient rights to restore user account." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    });

    revalidatePath("/users");
    return { success: "User account restored." };
  } catch (error) {
    return handleUnknownError(error);
  }
};

export const settings = async (values: z.infer<typeof editProfileSchema>) => {
  try {
    const user = await currentUser();

    if (!user) return { error: "Unauthorized!" };

    const dbUser = await getUserById(user.id!);

    if (!dbUser) return { error: "Unauthorized!" };

    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }

    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);

      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" };
      }

      const verificationToken = await generateVerificationToken(values.email);

      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: "Confirmation email sent!" };
    }

    const updateData: Partial<typeof values> = {
      name: values.name,
      email: values.email,
      isTwoFactorEnabled: values.isTwoFactorEnabled,
    };

    if (values.password && values.newPassword && dbUser.password) {
      const isPasswordMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );

      if (!isPasswordMatch) {
        return { error: "Invalid password!" };
      }

      const hashedPassword = await bcrypt.hash(values.newPassword, 10);

      updateData.password = hashedPassword;
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: updateData,
    });

    revalidatePath("/profile");
    return { success: "Profile updated!" };
  } catch (error) {
    return handleUnknownError(error);
  }
};

interface ChangeUserRoleParams {
  userId: string;
  newRole: UserRole;
}

export const changeUserRole = async ({
  userId,
  newRole,
}: ChangeUserRoleParams) => {
  try {
    const current = await currentUser();

    if (!current || current.role !== UserRole.ADMIN) {
      return { error: "Доступ заборонено. Потрібні права адміністратора." };
    }

    if (current.id === userId) {
      return { error: "Ви не можете змінити свою власну роль." };
    }

    const targetUser = await getUserById(userId);

    if (!targetUser) {
      return { error: "Користувача не знайдено." };
    }

    if (targetUser.role === newRole) {
      return { error: "Користувач вже має цю роль." };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/users");
    return { success: "Роль користувача успішно змінено." };
  } catch (error) {
    return handleUnknownError(error);
  }
};

export const softDeleteCurrentUser = async () => {
  try {
    const user = await currentUser();

    if (!user) {
      return { error: "Unauthorized!" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false },
    });

    revalidatePath("/users");
    return { success: "User account deactivated." };
  } catch (error) {
    console.error("Error deactivated current user:", error);
    return { error: "Somethig went wrong! Please try again." };
  }
};
