"use server";

import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { eventFormSchema, EventFormSchemaType } from "@/container/event/event";

import { EventsWithRelation } from "@/types/prisma-relations";
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

export async function addEvent(
  formData: EventFormSchemaType
): Promise<{ message: string; event?: EventsWithRelation }> {
  const validatedFields = eventFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { message: "Not valid Data." };
  }

  const eventExists = await prisma.events.findFirst({
    where: { name: formData.name },
  });

  if (eventExists) {
    return { message: "Event already exists." };
  }

  const event = await prisma.events.create({
    data: {
      name: formData.name,
      start: formData.start,
      end: formData.end,
      itemsReleaseType: formData.itemsReleaseType,
      createdById: formData.createdById,
    },
    include: {
      createdBy: true,
    },
  });

  revalidatePath("/events");
  revalidateTag("events");

  return { message: "Event added successfully!", event };
}

export async function editEvent(
  id: string,
  formData: EventFormSchemaType
): Promise<{ message: string; event?: EventsWithRelation }> {
  const validatedFields = eventFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { message: "Not valid Data." };
  }

  const eventExists = await prisma.events.findFirst({
    where: { id: id },
  });

  if (!eventExists) {
    return { message: "Event does not exist." };
  }

  const event = await prisma.events.update({
    where: { id: id },
    data: {
      name: formData.name,
      start: formData.start,
      end: formData.end,
      itemsReleaseType: formData.itemsReleaseType,
    },
    include: {
      createdBy: true,
    },
  });

  revalidatePath("/events");
  revalidateTag("events");

  return { message: "Event updated successfully!", event };
}
