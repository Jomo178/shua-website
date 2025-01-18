"use server";

import { getServerSession } from "next-auth/next";
import { DiscordProfile } from "next-auth/providers/discord";

import { env } from "@/env";

import { authOptions } from "./authOptions";

export async function getCurrentUser(isStaff = false) {
  const session = await getServerSession(authOptions);

  return session?.user;
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
