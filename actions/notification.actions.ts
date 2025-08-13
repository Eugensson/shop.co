"use server";

import * as z from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/prisma/prisma";
import { handleUnknownError } from "@/lib/utils";
import { CreateNotificationSchema, EditNotificationSchema } from "@/schemas";

export const createNotification = async (
  values: z.infer<typeof CreateNotificationSchema>
) => {
  const validatedFields = CreateNotificationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { name, subject, email, message } = validatedFields.data;

  try {
    await prisma.notification.create({
      data: {
        name,
        subject,
        email,
        message,
      },
    });
  } catch (error: unknown) {
    return handleUnknownError(error);
  }

  return { success: "Notification sent!" };
};

export const editNotification = async (
  values: z.infer<typeof EditNotificationSchema>
) => {
  const validatedFields = EditNotificationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Недійсні поля!" };
  }

  try {
    const { notificationId } = validatedFields.data;

    const existingNotification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { isRead: true },
    });

    if (!existingNotification) {
      return { error: "Notification not found!" };
    }

    if (existingNotification.isRead) {
      return;
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  } catch (error: unknown) {
    return handleUnknownError(error);
  }

  revalidatePath("/notifications");
};

export const deleteNotification = async (notificationId: string) => {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
  } catch (error: unknown) {
    return handleUnknownError(error);
  }

  revalidatePath("/notifications");
};
