import { ItemsType } from "@prisma/client";
import { z } from "zod";

export const eventFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  start: z.string().datetime(),
  end: z.string().datetime(),
  itemsReleaseType: z.nativeEnum(ItemsType, {
    message: "Release Type is required!",
  }),
  createdById: z.string(),
});

export type EventFormSchemaType = z.infer<typeof eventFormSchema>;

export const rarityFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
  icon: z.string().nonempty("Icon is required"),
  createdById: z.string().nonempty("Created By is required"),
});

export type RarityFormSchemaType = z.infer<typeof rarityFormSchema>;
