import { Dispatch, SetStateAction } from "react";

import { EventsWithRelation } from "@/types/prisma-relations";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface EventAddProps {
  setEventStateAction: Dispatch<SetStateAction<EventsWithRelation[]>>;
}

export function EventAdd({}: EventAddProps) {
  return <DateRangePicker initialDateFrom={new Date()} />;
}
