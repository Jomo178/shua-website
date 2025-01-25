import { notFound } from "next/navigation";
import AddCarousel from "@/container/add/add-carousel";
import { getCurrentEvent } from "@/server/events-action";
import { ItemsType, Rarity } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";
import { toUpperCase } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getAllRarities } from "../../action";

export async function generateStaticParams() {
  const types = Object.values(ItemsType);
  const rarities = await getAllRarities();
  return types.map((type) => ({
    item: type,
    rarities,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ item: ItemsType; rarities: Rarity[] }>;
}) {
  const { item, rarities = [] } = await params;
  const issueEvent = await getCurrentEvent(["issues"]);
  //TODO: Add a check for the issueEvent
  if (!issueEvent) return notFound();
  const getCurrentStaff = await getCurrentUser(true);
  if (!getCurrentStaff) return notFound();
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
            {!issueEvent ? null : (
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
