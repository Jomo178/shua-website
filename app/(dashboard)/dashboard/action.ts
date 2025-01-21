"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import {
  rarityFormSchema,
  RarityFormSchemaType,
} from "@/container/add/add-rarity";
import { StaffTableItems } from "@/container/staff/staff-columns";

import { prisma } from "@/lib/database";
import { fetchUserProfilesFromDiscord } from "@/lib/session";

export const getStaffAllInformation = unstable_cache(
  async () => {
    const staffsList = await prisma.staff.findMany();
    const staffEmailsList = await prisma.user.findMany();

    const staffDiscordProfile = await fetchUserProfilesFromDiscord(
      staffsList.map((staff) => staff.discordId)
    );

    const staffItems: StaffTableItems[] = staffsList.map((staff) => {
      const discordProfile = staffDiscordProfile.find(
        (profile) => profile.id === staff.discordId
      );

      const staffEmail = staffEmailsList.find(
        (email) => email.discordId === staff.discordId
      );

      return {
        ...staff,
        name: discordProfile?.username ?? "Unknown",
        image: discordProfile?.avatar ?? null,
        email: staffEmail?.email ?? "Not provided",
        global_name: discordProfile?.global_name ?? "Not provided",
        status: staff.isInTeam ? "Active" : "Inactive",
      };
    });

    return staffItems;
  },
  ["/staff"],
  { revalidate: 60 * 60 * 24, tags: ["staff"] }
);

export const getAllRarities = unstable_cache(
  async () => {
    const rarities = await prisma.rarity.findMany();
    return rarities;
  },
  ["/rarities"],
  { revalidate: 60 * 60 * 24, tags: ["rarities"] }
);

export async function addRarity(formData: RarityFormSchemaType) {
  const validatedFields = rarityFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { message: "Not valid Data." };
  }

  const rarityExists = await prisma.rarity.findUnique({
    where: { name: formData.name },
  });

  if (rarityExists) {
    return { message: "Rarity already exists with the same name." };
  }

  const rarity = await prisma.rarity.create({
    data: {
      name: formData.name,
      icon: formData.icon,
      createdById: formData.createdById,
    },
  });

  revalidatePath("/rarities");
  revalidateTag("rarities");

  return { message: "Rarity added successfully!", rarity };
}

//TODO: Add the function to check for duplicated issue codes

export async function checkForDuplicatedIssueCodes(
  codes: string[]
): Promise<string[]> {
  const duplicatedCodes = await prisma.issues.findMany({
    where: { code: { in: codes } },
    select: { code: true },
  });

  return duplicatedCodes.map((issue) => issue.code);
}
