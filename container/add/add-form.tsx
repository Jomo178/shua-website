"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rarity, Staff } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Info, Star } from "lucide-react";
import { useForm } from "react-hook-form";

import { toUpperCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FloatingLabelInput } from "@/components/ui/input";
import { Option } from "@/components/ui/multiselect";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { addFormSchema, AddFormSchemaType } from "./add";
import AddRarity from "./add-rarity";

// TODO: fix this
const NOSSRMULTISELECT = dynamic(() => import("@/components/ui/multiselect"), {
  ssr: false,
});

interface AddFormProps {
  index: number;
  currentUser: Staff;
  rarities: Rarity[];
  defaultValues?: AddFormSchemaType;
  hiddenFields?: (keyof AddFormSchemaType)[];
  onFormChangeAction: (form: AddFormSchemaType, index: number) => void;
}

export default function AddForm({
  index,
  currentUser,
  rarities,
  defaultValues = {} as any,
  hiddenFields = [],
  onFormChangeAction,
}: AddFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [raritiesState, setRarities] = useState<Rarity[]>(rarities);
  const form = useForm<AddFormSchemaType>({
    resolver: zodResolver(addFormSchema),
    defaultValues,
  });

  const isFieldHidden = (fieldName: keyof AddFormSchemaType) =>
    hiddenFields.includes(fieldName);

  const getFieldError = (fieldName: keyof AddFormSchemaType) =>
    defaultValues.errors?.find((error) => error?.path === fieldName)?.message ??
    "";

  const rarityArray = [
    { value: "xV", label: "Issue Level", disable: true },
    ...(Array.from({ length: 4 }, (_, i) => ({
      value: (i + 1).toString() + "_level",
      label: `Level ${i + 1}`,
      icon: Array.from({ length: i + 1 }, (_) => Star),
    })) as Option[]),
    { value: "xY", label: "Issue Icon", disable: true },
    ...raritiesState?.map((value) => ({
      value: value.name + "_icon",
      label: toUpperCase(value.name),
      image: `https://cdn.discordapp.com/emojis/${value.icon.split(":")[2]?.replace(">", "")}.webp?size=44`,
    })),
  ];

  return (
    <Form {...form}>
      <form
        className="p-4"
        onChange={() => onFormChangeAction(form.getValues(), index)}
      >
        <div className="ml-auto mr-auto h-full max-w-fit">
          <div className="flex h-full w-72 flex-col items-center gap-6">
            {!isFieldHidden("name") && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Issue General Information</FormLabel>
                    <FormControl>
                      <FloatingLabelInput
                        {...field}
                        id="name"
                        label="Issue Name"
                      />
                    </FormControl>
                    <FormMessage>{getFieldError("name")}</FormMessage>
                  </FormItem>
                )}
              />
            )}
            {!isFieldHidden("era") && (
              <FormField
                control={form.control}
                name="era"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FloatingLabelInput
                        {...field}
                        id="era"
                        label="Issue Era"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage>{getFieldError("era")}</FormMessage>
                  </FormItem>
                )}
              />
            )}
            {!isFieldHidden("group") && (
              <FormField
                control={form.control}
                name="group"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <FloatingLabelInput
                        {...field}
                        id="group"
                        label="Issue Group"
                      />
                    </FormControl>
                    <FormMessage>{getFieldError("group")}</FormMessage>
                  </FormItem>
                )}
              />
            )}
            {!isFieldHidden("code") && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex justify-between">
                      <p>Issue Code</p>
                      <Tooltip>
                        <TooltipTrigger disabled className="cursor-pointer">
                          <Info size={16} />
                        </TooltipTrigger>
                        <TooltipContent className="w-72">
                          {/* //TODO: fix this */}
                          <p className="mb-2 font-semibold">Code Generation:</p>
                          <ul className="ml-4 list-disc">
                            <li>
                              <strong>Group</strong>: First 3 letters (e.g., BTS
                              → BTS).
                            </li>
                            <li>
                              <strong>Version</strong>: 1, 2, 3, etc.
                            </li>
                            <li>
                              <strong>Artist</strong>: First 2 letters (e.g.,
                              Jimin → JM).
                            </li>
                            <li>
                              <strong>Tier</strong>: 1, 2, 3, 4.
                            </li>
                            <li>
                              <strong>Event</strong>: Add event initial before
                              group name.
                            </li>
                          </ul>
                          <p className="mt-2 font-medium">Examples:</p>
                          <p className="font-mono">
                            Regular: BTS1JM2 <br />
                            Event: AIRJE
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <FloatingLabelInput
                        {...field}
                        id="code"
                        label="Issue Code"
                      />
                    </FormControl>
                    <FormMessage>{getFieldError("code")}</FormMessage>
                  </FormItem>
                )}
              />
            )}
            {!isFieldHidden("rarity") && (
              <>
                <Separator className="my-1" />
                <FormField
                  control={form.control}
                  name="rarity"
                  render={({ field, fieldState }) => {
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Issue Rarity</FormLabel>
                        <FormControl>
                          <NOSSRMULTISELECT
                            commandProps={{
                              label: "Select level",
                            }}
                            title="rarity"
                            defaultOptions={rarityArray}
                            value={
                              [
                                rarityArray.find(
                                  (r) =>
                                    r.value === `${field.value.level}_level`
                                ),
                                rarityArray.find(
                                  (r) => r.value === `${field.value.icon}_icon`
                                ),
                              ].filter(Boolean) as Option[]
                            }
                            placeholder="Select level"
                            hidePlaceholderWhenSelected
                            emptyIndicator={
                              <p className="text-center text-sm">
                                No results found
                              </p>
                            }
                            onClick={() => setIsOpen(true)}
                            onChange={(value) => {
                              const level = value
                                .find((v) => v.value.includes("level"))
                                ?.value?.split("_")[0];

                              const icon = value
                                .find((v) => v.value.includes("icon"))
                                ?.value?.split("_")[0];

                              form.setValue("rarity", {
                                level: Number(level),
                                icon: icon ?? "",
                              });

                              onFormChangeAction(form.getValues(), index);
                            }}
                          />
                        </FormControl>
                        <FormMessage>{getFieldError("rarity")}</FormMessage>
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
            {!isFieldHidden("releaseDate") && (
              <FormField
                control={form.control}
                name="releaseDate"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex justify-between">
                      Release Date
                      <Tooltip>
                        <TooltipTrigger disabled className="cursor-pointer">
                          <Info size={16} />
                        </TooltipTrigger>
                        <TooltipContent className="w-56">
                          {/* //TODO: fix this */}
                          <p>
                            The date the issue will be released. This is the
                            date the issue will be available to the public after
                            been approved.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        disabled
                        className="w-full font-normal"
                      >
                        {format(field.value, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                    <FormMessage>{getFieldError("releaseDate")}</FormMessage>
                  </FormItem>
                )}
              />
            )}
            {!isFieldHidden("image") && (
              <>
                <Separator className="my-1" />
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem className="w-full">
                      <FormLabel>Issue Image</FormLabel>
                      <FormControl>
                        <FileUploader
                          value={
                            form.getValues("image")?.name &&
                            form.getValues("image").name !== "filename"
                              ? [form.getValues("image")]
                              : []
                          }
                          onValueChange={(value) => {
                            form.setValue("image", value[0]);

                            onFormChangeAction(form.getValues(), index);
                          }}
                        />
                      </FormControl>
                      <FormMessage>{getFieldError("image")}</FormMessage>
                    </FormItem>
                  )}
                />
              </>
            )}
            <AddRarity
              currentUser={currentUser}
              isOpen={isOpen}
              setIsOpenAction={setIsOpen}
              setRaritiesAction={setRarities}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
