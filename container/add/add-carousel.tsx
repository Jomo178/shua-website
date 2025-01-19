"use client";

import { useEffect, useState } from "react";
import { Rarity, Staff } from "@prisma/client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { AddFormSchemaType, defaultAddFromValues } from "./add";
import AddForm from "./add-form";

interface AddCarouselProps {
  rarities: Rarity[];
  currentUser: Staff;
  eventReleaseDate: Date;
}

export default function AddCarousel({
  rarities,
  currentUser,
  eventReleaseDate,
}: AddCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [defaultFormValues, setDefaultFormValues] = defaultAddFromValues();
  const [itemsFormPropsValue, setItemsFormPropsValue] = useState<
    AddFormSchemaType[]
  >([
    {
      ...defaultFormValues,
      releaseDate: new Date(eventReleaseDate).toISOString(),
      errors: [],
    },
  ]);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <>
      <Carousel setApi={setApi} className="w-full !max-w-xs sm:!max-w-sm">
        <CarouselContent>
          {itemsFormPropsValue?.map((itemsForm, index) => (
            <CarouselItem key={itemsForm.id}>
              <AddForm
                key={itemsForm.id}
                defaultValues={itemsForm}
                currentUser={currentUser}
                rarities={rarities}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        issues {current} of {count}
      </div>
    </>
  );
}
