"use server";

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/database";

export const getAllEvents = unstable_cache(
  async () => {
    const events = await prisma.events.findMany({
      include: {
        createdBy: true,
      },
    });

    return events;
  },
  ["/events"],
  { revalidate: 60 * 60 * 24, tags: ["events"] }
);
