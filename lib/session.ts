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
    where: { discordId: session?.user?.id ?? "" },
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
  ids: string[],
  batchSize: number = 5, // Max 10 requests per second
  delay: number = 150 // 1 sec delay between batches
): Promise<DiscordProfile[]> {
  const fetchProfile = async (id: string): Promise<DiscordProfile> => {
    const response = await fetch(`https://discord.com/api/users/${id}`, {
      headers: {
        Authorization: `Bot ${env.DISCORD_CLIENT_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch profile for ID ${id}: ${response.statusText}`
      );
    }

    const data: DiscordProfile = await response.json();

    if (data.avatar === null) {
      data.avatar = `https://cdn.discordapp.com/embed/avatars/${
        parseInt(data.discriminator) % 5
      }.png`;
    } else {
      const format = data.avatar.startsWith("a_") ? "gif" : "png";
      data.avatar = `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${format}`;
    }

    return data;
  };

  let results: DiscordProfile[] = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);

    // Send batch of requests in parallel
    const batchResults = await Promise.allSettled(batch.map(fetchProfile));

    // Filter successful results
    results = results.concat(
      batchResults.flatMap((res) =>
        res.status === "fulfilled" ? [res.value] : []
      )
    );

    if (i + batchSize < ids.length) {
      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait 1 second before next batch
    }
  }

  return results;
}
