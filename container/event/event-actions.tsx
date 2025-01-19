"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { addEvent, editEvent } from "@/server/events-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Staff } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { EventsWithRelation } from "@/types/prisma-relations";
import { Button } from "@/components/ui/button";

import { eventFormSchema, EventFormSchemaType } from "./event";
import { EventForm } from "./event-form";

interface EventAddProps {
  currentUser: Staff;
  setEventStateAction: Dispatch<SetStateAction<EventsWithRelation[]>>;
}

export function EventAdd({ currentUser, setEventStateAction }: EventAddProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<EventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
      itemsReleaseType: "issues",
      createdById: currentUser.id,
    },
  });

  const onSubmit = (values: EventFormSchemaType) => {
    setIsOpen(false);

    toast.promise(addEvent(values), {
      loading: "Adding event...",
      success({ message, event }) {
        form.reset();
        if (!event) return message;
        setEventStateAction((prevData) => [
          ...prevData,
          {
            ...event,
          },
        ]);
        return message;
      },
      error: "Failed to add event.",
    });
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Event</Button>
      <EventForm
        form={form}
        isOpen={isOpen}
        setIsOpenAction={setIsOpen}
        onSubmitAction={onSubmit}
        title="Add Event"
      />
    </>
  );
}

interface EventEditProps extends React.HTMLAttributes<HTMLDivElement> {
  event: EventsWithRelation;
  setEventStateAction: Dispatch<SetStateAction<EventsWithRelation[]>>;
  isOpen: boolean;
  setIsOpenAction: Dispatch<SetStateAction<boolean>>;
}

export function EventEdit({
  event,
  setEventStateAction,
  isOpen,
  setIsOpenAction,
  ...props
}: EventEditProps) {
  const form = useForm<EventFormSchemaType>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event.name,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      itemsReleaseType: event.itemsReleaseType,
      createdById: event.createdById,
    },
  });

  const onSubmit = (values: EventFormSchemaType) => {
    setIsOpenAction(false);

    toast.promise(editEvent(event.id, values), {
      loading: "Updating event...",
      success({ message, event }) {
        form.reset();
        if (!event) return message;
        setEventStateAction((prevData) => [
          ...prevData.filter((e) => e.id !== event.id),
          {
            ...event,
          },
        ]);
        return message;
      },
      error: "Failed to update event.",
    });
  };

  return (
    <div {...props}>
      <EventForm
        form={form}
        isOpen={isOpen}
        setIsOpenAction={setIsOpenAction}
        onSubmitAction={onSubmit}
        title="Edit Event"
      />
    </div>
  );
}
