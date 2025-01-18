import { Staff } from "@prisma/client";

import { EventsWithRelation } from "@/types/prisma-relations";
import { formatTimestamp } from "@/lib/utils";
import { ProjectStatusCard } from "@/components/ui/expandable-card";

interface EventCardProps {
  currentUser: Staff;
  event: EventsWithRelation;
}

function EventCard({ currentUser, event }: EventCardProps) {
  return (
    <ProjectStatusCard
      title={event.name}
      progress={10}
      dueDate={formatTimestamp(new Date(event.end))}
      contributors={[
        { name: "Emma" },
        { name: "John" },
        { name: "Lisa" },
        { name: "David" },
      ]}
      tasks={[
        { title: "Create a new design", completed: true },
        { title: "Update the documentation", completed: true },
        { title: "Fix the issue", completed: false },
        { title: "Push the changes", completed: false },
      ]}
      githubStars={256}
      openIssues={0}
    />
  );
}

export default EventCard;
