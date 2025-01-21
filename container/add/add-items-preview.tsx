"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Rarity } from "@prisma/client";
import { Eye, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CarouselApi } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { checkForDuplicatedIssueCodes } from "@/app/(dashboard)/dashboard/action";

import { addFormSchema, AddFormSchemaType, scrollToCarousel } from "./add";

interface AddItemsPreviewProps {
  itmesFormPropsValue: AddFormSchemaType[];
  setItemsFormPropsValueAction: React.Dispatch<
    React.SetStateAction<AddFormSchemaType[]>
  >;
  carouselApi: CarouselApi;
  rarities: Rarity[];
}

function AddItemsPreview({
  itmesFormPropsValue,
  setItemsFormPropsValueAction,
  carouselApi,
  rarities,
}: AddItemsPreviewProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const openPreview = async () => {
    const formErrors = itmesFormPropsValue.map((item, index) => {
      const checkEmptyProps = addFormSchema.safeParse(item);

      return (
        checkEmptyProps.error?.issues.map((error) => ({
          index,
          path: error.path[0].toString(),
          message: error.message,
        })) || []
      );
    });

    if (formErrors.length > 0) {
      setItemsFormPropsValueAction((prev) => {
        return prev.map((item, index) => {
          const errors = formErrors[index];
          return {
            ...item,
            errors: errors.length > 0 ? errors : [],
          };
        });
      });

      for (let i = 0; i < formErrors.length; i++) {
        if (!formErrors[i].length) continue;
        toast.error(`Issue Form Error`, {
          description: `Please fill out the required fields before uploading.`,
          action: {
            label: "Jump",
            onClick: () =>
              scrollToCarousel(carouselApi, formErrors[i][0].index),
          },
        });
        break;
      }
    }

    if (formErrors.some((errors) => errors.length > 0)) return;

    const checkCodesPromise = checkForDuplicatedIssueCodes(
      itmesFormPropsValue.map((item) => item.code)
    );

    toast.promise(checkCodesPromise, {
      loading: `Checking for duplicate issue codes...`,
      success: `Duplicate issue codes have been checked successfully.`,
      error: `Error checking duplicate issue codes.`,
    });

    const checkCodes = await checkCodesPromise;

    setItemsFormPropsValueAction((prev) => {
      return prev.map((item) => {
        if (!checkCodes.includes(item.code)) return item;
        return {
          ...item,
          codeDuplicate: true,
          errors: checkCodes.includes(item.code)
            ? [
                ...(item.errors || []),
                {
                  message: `Duplicate Issue Code`,
                  path: "code",
                },
              ]
            : item.errors,
        };
      });
    });

    if (checkCodes.length != 0) {
      for (let i = 0; i < checkCodes.length; i++) {
        toast.error("Duplicate Issue Code", {
          description:
            "Please change the issue code to a unique one before uploading.",
          action: {
            label: "Jump to Form",
            onClick: () =>
              scrollToCarousel(
                carouselApi,
                itmesFormPropsValue.findIndex(
                  (item) => item.code === checkCodes[i]
                )
              ),
          },
        });
        break;
      }
      return;
    }

    setOpenDialog(true);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" onClick={openPreview}>
            <Eye size={24} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload Preview</p>
        </TooltipContent>
      </Tooltip>

      <Sheet open={openDialog} onOpenChange={setOpenDialog}>
        <SheetContent className="!w-full p-4 sm:max-w-none">
          <SheetHeader className="border-b-2 pb-4">
            <SheetTitle>All Issues Preview</SheetTitle>
            <SheetDescription>
              Scroll through all the issues to review their details.
            </SheetDescription>
          </SheetHeader>
          <div className="grid h-[80vh] grid-cols-1 gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-4">
            {itmesFormPropsValue.map((item, index) => {
              return (
                <CardPreview item={item} rarities={rarities} key={item.id} />
              );
            })}
            {/* <div className="flex flex-row sm:col-span-2 md:col-span-4 md:justify-end">
              <Button
                variant="expandIcon"
                className="mb-4 w-full md:mr-8 md:w-auto"
                onClick={() => onSubmitAction()}
                Icon={Icons.upload}
                iconPlacement="right"
              >
                Upload {toUpperCase(itemNameType)}
              </Button> */}
            {/* </div> */}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function CardPreview({
  item,
  rarities,
}: {
  item: AddFormSchemaType;
  rarities: Rarity[];
}) {
  const imageUrl = useMemo(() => {
    if (item.image && Object.keys(item.image).length > 0) {
      return URL.createObjectURL(item.image);
    }
    return "";
  }, [item.image]);

  const rarity =
    rarities.find((rarity) => rarity.name === item.rarity.icon)?.icon ||
    rarities[0].icon;

  return (
    <Card
      className="mx-auto mb-10 flex w-full max-w-xs items-center border-0 sm:flex-col"
      key={item.id}
    >
      <CardContent className="flex aspect-auto items-center justify-center p-0">
        {Object.keys(item.image).length > 0 && (
          <Image
            src={imageUrl}
            alt={item.name}
            className="max-w-48 rounded-md"
            width={192}
            height={162}
          />
        )}
      </CardContent>
      <Separator className="mx-auto my-4 hidden max-w-[50%] sm:block" />
      <CardHeader className="w-full p-0 text-center">
        <div className="mx-[25%] flex min-h-full max-w-[50%] flex-row">
          <Separator
            orientation="vertical"
            className="hidden w-[2px] sm:block"
          />
          <div className="sm:flex-1">
            <TextInformation title="Name" description={item.name} />

            <TextInformation title="Group" description={item.group} />

            <TextInformation title="Era" description={item.era} />

            <TextInformation title="Code" description={item.code} />

            <div className="flex items-center justify-between">
              <Separator className="hidden h-[2px] w-4 sm:block" />
              <span className="text-left text-sm font-medium leading-none text-muted-foreground">
                Level:
              </span>
              <span className="!mt-0 flex w-1/2 text-left text-sm font-medium leading-none text-muted-foreground">
                {Array.from({ length: item.rarity.level }).map(
                  (_, starIndex) => (
                    <Star key={starIndex} size={16} />
                  )
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Separator className="hidden h-[2px] w-4 sm:block" />
              <span className="text-left text-sm font-medium leading-none text-muted-foreground">
                Rarity:
              </span>
              <Image
                src={`https://cdn.discordapp.com/emojis/${rarity.split(":")[2]?.replace(">", "")}.webp?size=44`}
                alt={item.name}
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function TextInformation({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <Separator className="hidden h-[2px] w-4 sm:block" />
      <span className="text-left text-sm font-medium leading-none text-muted-foreground">
        {title}:
      </span>
      <span className="!mt-0 w-1/2 text-left text-base font-medium leading-none">
        {description}
      </span>
    </div>
  );
}

export default AddItemsPreview;
