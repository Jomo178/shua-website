"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import {
  rarityFormSchema,
  RarityFormSchemaType,
} from "@/container/event/event";
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

      console.log("discordProfile", discordProfile);

      const staffEmail = staffEmailsList.find(
        (email) => email.discordId === staff.discordId
      );

      return {
        ...staff,
        name: discordProfile?.username,
        image: discordProfile?.avatar ?? null,
        email: staffEmail?.email ?? "Not provided",
        global_name: discordProfile?.global_name ?? "Not provided",
        status: staff.isInTeam ? "Active" : "Inactive",
      };
    });

    return staffItems;
  },
  ["/dashboard/staff"],
  { revalidate: 60 * 60 * 5, tags: ["all-staff"] }
);

export const getAllRarities = unstable_cache(
  async () => {
    const rarities = await prisma.rarity.findMany();
    return rarities;
  },
  ["/dashboard/add/issues"],
  { revalidate: 60 * 60 * 24, tags: ["all-rarities"] }
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

  revalidateTag("all-rarities");

  return { message: "Rarity added successfully!", rarity };
}

export async function checkForDuplicatedIssueCodes(
  codes: string[]
): Promise<string[]> {
  const [duplicatedCodes, pendingIssues] = await Promise.all([
    prisma.issues.findMany({
      where: { code: { in: codes } },
      select: { code: true },
    }),
    prisma.pendingIssues.findMany({
      where: { code: { in: codes } },
      select: { code: true },
    }),
  ]);

  const allDuplicatedCodes = [
    ...duplicatedCodes.map((issue) => issue.code),
    ...pendingIssues.map((issue) => issue.code),
  ];

  return allDuplicatedCodes;
}
