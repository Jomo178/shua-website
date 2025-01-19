"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rarity, Staff } from "@prisma/client";
import { Info } from "lucide-react";
import { useForm } from "react-hook-form";

import { formatTimestamp, toUpperCase } from "@/lib/utils";
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
import SelectWithButton from "@/components/ui/select-with-button";
import { Separator } from "@/components/ui/separator";
import { Shell } from "@/components/ui/shell";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { addFormSchema, AddFormSchemaType } from "./add";
import AddRarity from "./add-rarity";

interface AddFormProps {
  currentUser: Staff;
  rarities: Rarity[];
  defaultValues?: AddFormSchemaType;
  hiddenFields?: (keyof AddFormSchemaType)[];
}

export default function AddForm({
  currentUser,
  rarities,
  defaultValues = {} as any,
  hiddenFields = [],
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

  return (
    <Shell variant="centered">
      <Form {...form}>
        <form className="p-4">
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
                          <TooltipContent>
                            {/* //TODO: fix this */}
                            <p>Code is generated as follows:</p>
                            <ul className="ml-4 list-disc">
                              <li>First and Last letters of Name</li>
                              <li>First two letters of Act (no spaces)</li>
                              <li>First two letters of Group (no spaces)</li>
                              <li>Rarity number</li>
                            </ul>
                            <p>
                              <code>
                                Name: IU, Act: Last Fantasy, Group: Soloist,
                                Rarity: 1
                              </code>
                            </p>
                            <p>
                              <code>Code: IULASO1</code>
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
                    render={({ field, fieldState }) => (
                      <FormItem className="w-full">
                        <FormLabel>Issue Rarity</FormLabel>
                        <FormControl>
                          <SelectWithButton
                            options={raritiesState?.map((value) => ({
                              value: value.icon,
                              label: toUpperCase(value.name),
                              image: `https://cdn.discordapp.com/emojis/${value.icon.split(":")[2]?.replace(">", "")}.webp?size=44`,
                            }))}
                            title="rarity"
                            onValueChangeAction={(value) => {
                              form.setValue("rarity", {
                                name: value.label,
                                icon: value.value,
                              });
                              form.trigger("rarity");
                            }}
                            onClick={() => setIsOpen(true)}
                          />
                        </FormControl>
                        <FormMessage>{getFieldError("rarity")}</FormMessage>
                      </FormItem>
                    )}
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
                          <TooltipContent>
                            {/* //TODO: fix this */}
                            <p>Code is generated as follows:</p>
                            <ul className="ml-4 list-disc">
                              <li>First and Last letters of Name</li>
                              <li>First two letters of Act (no spaces)</li>
                              <li>First two letters of Group (no spaces)</li>
                              <li>Rarity number</li>
                            </ul>
                            <p>
                              <code>
                                Name: IU, Act: Last Fantasy, Group: Soloist,
                                Rarity: 1
                              </code>
                            </p>
                            <p>
                              <code>Code: IULASO1</code>
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </FormLabel>
                      <FormControl>
                        <FloatingLabelInput
                          value={formatTimestamp(new Date(field.value))}
                          disabled
                          id="releaseDate"
                          label="Issue Release Date"
                          className="w-full"
                        />
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
    </Shell>
  );
}
