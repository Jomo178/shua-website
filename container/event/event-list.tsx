"use client";

import { useState } from "react";

import { EventsWithRelation } from "@/types/prisma-relations";

import { EventAdd } from "./event-actions";

interface EventsListProps {
  events: EventsWithRelation[];
}

function EventsList({ events }: EventsListProps) {
  //   if (events.length == 0) {
  //     return <div>No events found.</div>;
  //   }

  const [eventState, setEventState] = useState<EventsWithRelation[]>(events);
  const currentDate = new Date();
  const currentEvents = eventState.filter(
    (event) =>
      new Date(event.start) <= currentDate && new Date(event.end) >= currentDate
  );
  const pastEvents = eventState.filter(
    (event) => new Date(event.end) < currentDate
  );
  const upcomingEvents = eventState.filter(
    (event) => new Date(event.start) > currentDate
  );

  let nextEvent: EventsWithRelation | null = null;
  if (upcomingEvents.length > 0) {
    nextEvent = upcomingEvents.sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    )[0];

    if (nextEvent.name.includes("Shua Release")) {
      const alternativeEvent = upcomingEvents.find(
        (event) => !event.name.includes("Shua Release")
      );

      if (alternativeEvent) {
        nextEvent = alternativeEvent;
        upcomingEvents.splice(upcomingEvents.indexOf(alternativeEvent), 1);
      }
    } else {
      upcomingEvents.splice(upcomingEvents.indexOf(nextEvent), 1);
    }
  }

  return (
    <div className="container mt-10 space-y-5">
      <div>
        <EventAdd setEventStateAction={setEventState} />
      </div>
    </div>
  );
}

export default EventsList;
