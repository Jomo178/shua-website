import Link from "next/link";
import { notFound } from "next/navigation";
import AddCarousel from "@/container/add/add-carousel";
import { getCurrentEvent } from "@/server/events-action";
import { ItemsType, Rarity } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { toUpperCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getAllRarities } from "../../action";

export async function generateStaticParams() {
  const types = Object.values(ItemsType);
  const rarities = await getAllRarities();
  return types.map((type) => ({
    items: type,
    rarities,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ items: ItemsType; rarities: Rarity[] }>;
}) {
  const { items, rarities = [] } = await params;
  const issueEvent = await getCurrentEvent([items]);
  const getCurrentStaff = await getCurrentUser(true);
  if (!getCurrentStaff?.staff || !getCurrentStaff.staff.isInTeam)
    return notFound();
  if (!rarities || rarities?.length === 0)
    rarities.push(...(await getAllRarities()));

  return (
    <Tabs
      defaultValue="issues"
      className="py-6 sm:ml-auto sm:mr-auto sm:max-h-fit sm:min-w-[400px] sm:max-w-fit sm:px-6 md:p-11"
    >
      <TabsList className="w-full">
        <TabsTrigger value={"issues"} className="h-full w-full">
          {toUpperCase("issues")}
        </TabsTrigger>
        <TabsTrigger disabled value={"events"} className="h-full w-full">
          {toUpperCase("events")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="issues">
        <Card className="ml-auto mr-auto max-h-fit max-w-fit p-6 md:p-11">
          <CardContent>
            {!issueEvent ? (
              <EmptyState
                className="border-none"
                title={`No Issue event found`}
                description={`Please create an issue event first`}
                action={
                  <Link href="/dashboard/events" prefetch={true}>
                    <Button variant="outline">Create Event</Button>
                  </Link>
                }
              />
            ) : (
              <AddCarousel
                rarities={rarities}
                currentUser={getCurrentStaff.staff}
                event={issueEvent}
              />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
