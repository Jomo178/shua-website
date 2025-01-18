"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { staffFormSchema, StaffFormSchemaType } from "@/container/staff/staff";

import { prisma } from "@/lib/database";
import { fetchUserProfilesFromDiscord } from "@/lib/session";

export async function addStaff(formData: StaffFormSchemaType) {
  const validatedFields = staffFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { message: "Not valid Data." };
  }

  const staffExists = await prisma.staff.findUnique({
    where: { discordId: formData.discordId },
  });

  if (staffExists) {
    return { message: "Staff already exists." };
  }

  const createStaff = await prisma.staff.create({
    data: {
      discordId: formData.discordId,
      role: formData.role,
      create: { set: formData.create },
      edit: { set: formData.edit },
      delete: { set: formData.delete },
      handle: { set: formData.handle },
    },
  });

  if (!createStaff) {
    return { message: "Failed to add staff." };
  }

  const staffDiscordInfo = await fetchUserProfilesFromDiscord([
    formData.discordId,
  ]);

  revalidatePath("/staff");
  revalidateTag("staff");

  return { message: "Staff added successfully!", staff: staffDiscordInfo[0] };
}
