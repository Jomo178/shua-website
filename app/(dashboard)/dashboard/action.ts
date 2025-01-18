"use server";

import { unstable_cache } from "next/cache";
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
