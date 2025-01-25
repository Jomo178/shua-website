import { Prisma } from "@prisma/client";

const itemsInclude = {
  createdBy: true,
  approvedBy: true,
  event: true,
  rejections: {
    include: {
      rejectedBy: true,
      resubmittedBy: true,
    },
  },
} as const;

export type IssuesWithRelation = Omit<
  Prisma.IssuesGetPayload<{
    include: typeof itemsInclude;
  }>,
  "rarity"
> & {
  rarity: { level: number; icon: string };
};

export type PendingIssuesWithRelation = Omit<
  Prisma.PendingIssuesGetPayload<{
    include: typeof itemsInclude;
  }>,
  "rarity"
> & {
  rarity: { level: number; icon: string };
};

export type EventsWithRelation = Prisma.EventsGetPayload<{
  include: { createdBy: true; issues: true; pendingIssues: true };
}>;
