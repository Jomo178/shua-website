import { notFound } from "next/navigation";
import AddForm from "@/container/add/add-form";
import { getCurrentEvent } from "@/server/events-action";
import { ItemsType } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";

export async function generateStaticParams() {
  const types = Object.values(ItemsType);
  return types.map((type) => ({
    item: type,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ item: ItemsType }>;
}) {
  const item = (await params).item;
  const issueEvent = await getCurrentEvent(["issues"]);
  const getCurrentStaff = await getCurrentUser(true);
  if (!getCurrentStaff) return notFound();

  return <AddForm />;
}
