import EventsList from "@/container/event/event-list";
import { getAllEvents } from "@/server/events-action";

export default async function Page() {
  const getEvents = await getAllEvents();

  console.log(getEvents);
  return (
    <div className="px-4 sm:px-6">
      <EventsList events={getEvents} />
    </div>
  );
}
