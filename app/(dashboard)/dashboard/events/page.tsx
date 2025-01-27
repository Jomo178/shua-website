import { notFound } from "next/navigation";
import EventsList from "@/container/event/event-list";
import { getAllEvents } from "@/server/events-action";

import { getCurrentUser } from "@/lib/session";

import { getStaffAllInformation } from "../action";

export default async function Page() {
  const getEvents = await getAllEvents();
  const staffItems = await getStaffAllInformation();
  const getCurrentStaff = await getCurrentUser(true);
  if (!getCurrentStaff?.staff || !getCurrentStaff.staff.isInTeam)
    return notFound();

  return (
    <div className="px-4 sm:px-6">
      <EventsList
        events={getEvents}
        currentUser={getCurrentStaff.staff}
        allStaffInformation={staffItems}
      />
    </div>
  );
}
