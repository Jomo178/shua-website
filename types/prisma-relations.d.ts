import { Prisma } from "@prisma/client";

export type EventsWithRelation = Prisma.EventsGetPayload<{
  include: { createdBy: true };
}>;
