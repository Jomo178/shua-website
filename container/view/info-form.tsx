"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllEvents } from "@/server/events-action";
import { updateMissingInformation } from "@/server/view-set-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { EventsWithRelation } from "@/types/prisma-relations";
import { ItemListingView, ItemType } from "@/types/view";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStaffAllInformation } from "@/app/(dashboard)/dashboard/action";

import { StaffTableItems } from "../staff/staff-columns";

export const formSchema = z.object({
  issuesIds: z.array(z.string()),
  createdById: z.string(),
  approvedById: z.string(),
  eventId: z.string(),
});

function InfoForm({
  selectedIssues,
  setViewTypeDataAction,
}: {
  selectedIssues: ItemType<"issues">[0][] | ItemType<"issues">[1][];
  setViewTypeDataAction: React.Dispatch<
    React.SetStateAction<ItemListingView<"issues">>
  >;
}) {
  const [staffData, setStaffData] = useState<StaffTableItems[]>([]);
  const [eventsData, setEventsData] = useState<EventsWithRelation[]>([]);

  useEffect(() => {
    async function fetchData() {
      const staff = await getStaffAllInformation();
      const events = await getAllEvents();
      setStaffData(staff);
      setEventsData(events);
    }

    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issuesIds: selectedIssues.map((issue) => issue.id),
      approvedById: "6796197ca81cbed401b1c028",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast.promise(updateMissingInformation(data), {
      loading: "Updating issues...",
      success({ message, updatedItems }) {
        setViewTypeDataAction((prev) => {
          const removedItems = prev.data.filter(
            (item) => !data.issuesIds.includes(item.id)
          );

          return {
            ...prev,
            data: [...removedItems],
            selectedItems: [],
          };
        });

        return message;
      },
      error: "Failed to update issues.",
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto max-w-sm space-y-8 py-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="createdById"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Created By</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="h-auto ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
                    <SelectValue placeholder="Choose a staff" />
                  </SelectTrigger>
                  <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                    {staffData.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <span className="flex items-center gap-2">
                          <Image
                            className="rounded-full"
                            src={staff.image ?? "/images/shua.png"}
                            alt={staff.name ?? "Shua"}
                            width={40}
                            height={40}
                          />
                          <span>
                            <span className="block font-medium">
                              {staff.name}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {staff.global_name}
                            </span>
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose the staff member who created the issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="approvedById"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Approved By</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="h-auto ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
                    <SelectValue placeholder="Choose a staff" />
                  </SelectTrigger>
                  <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                    {staffData.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <span className="flex items-center gap-2">
                          <Image
                            className="rounded-full"
                            src={staff.image ?? "/images/shua.png"}
                            alt={staff.name ?? "Shua"}
                            width={40}
                            height={40}
                          />
                          <span>
                            <span className="block font-medium">
                              {staff.name}
                            </span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">
                              {staff.global_name}
                            </span>
                          </span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose the staff member who approved the issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="h-auto ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
                    <SelectValue placeholder="Choose an event" />
                  </SelectTrigger>
                  <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                    {eventsData.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                Choose the event that the issue is related to.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <h1 className="underline">Selected Issues:</h1>
          <div className="grid grid-cols-4 gap-2">
            {selectedIssues.map((issue) => (
              <div key={issue.id}>
                <p>{issue.name}</p>
              </div>
            ))}
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default InfoForm;
