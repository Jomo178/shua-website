"use server";

import { Staff } from "@prisma/client";
import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { DiscordProfile } from "next-auth/providers/discord";

import { env } from "@/env";

import { authOptions } from "./authOptions";
import { prisma } from "./database";

export async function getCurrentUser<T extends boolean>(
  isStaff: T
): Promise<
  T extends false
    ? Session["user"] | null
    : { session: Session["user"] | null; staff: Staff }
> {
  const session = await getServerSession(authOptions);

  if (!isStaff) {
    // Explicit return for T extends false
    return (session?.user ?? null) as T extends false
      ? Session["user"] | null
      : never;
  }

  const findStaff = await prisma.staff.findUnique({
    where: { discordId: session?.user?.id },
  });

  if (!findStaff) {
    // Explicit return for T extends false (fallback for staff not found)
    return (session?.user ?? null) as T extends false
      ? Session["user"] | null
      : never;
  }

  // Explicit return for T extends true
  return {
    session: session?.user ?? null,
    staff: findStaff,
  } as any;
}

export async function fetchUserProfilesFromDiscord(
  ids: string[]
): Promise<DiscordProfile[]> {
  const fetchProfile = async (id: string): Promise<DiscordProfile> => {
    const response = await fetch(`https://discord.com/api/users/${id}`, {
      headers: {
        Authorization: `Bot ${env.DISCORD_CLIENT_TOKEN}`,
      },
    });

    const data: DiscordProfile = await response.json();

    if (data.avatar === null) {
      data.avatar = `https://cdn.discordapp.com/embed/avatars/${
        parseInt(data.discriminator) % 5
      }.png`;
    } else {
      const format = data.avatar?.startsWith("a_") ? "gif" : "png";
      data.avatar = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${format}`;
    }

    return data;
  };

  return Promise.all(ids.map(fetchProfile));
}
