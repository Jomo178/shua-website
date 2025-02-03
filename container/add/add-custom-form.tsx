"use client";

import { useState } from "react";
import { Events, Rarity, Staff } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";

import { AddFormSchemaType } from "./add";
import AddForm from "./add-form";

interface ItemsCustomPropertiesDialogProps {
  currentUser: Staff;
  rarities: Rarity[];
  setItemFormPropsValueAction: React.Dispatch<
    React.SetStateAction<AddFormSchemaType[]>
  >;
  getNewCustomProps: AddFormSchemaType;
  setNewCustomPropsAction: React.Dispatch<
    React.SetStateAction<AddFormSchemaType>
  >;
  openDialog: boolean;
  setOpenDialogAction: React.Dispatch<React.SetStateAction<boolean>>;
  event: Events;
}

export function ItemsCustomPropertiesDialog({
  currentUser,
  rarities,
  setItemFormPropsValueAction,
  getNewCustomProps,
  setNewCustomPropsAction,
  openDialog,
  setOpenDialogAction,
  event,
}: ItemsCustomPropertiesDialogProps) {
  const [itemsFormPropsValue, setItemsFormPropsValue] =
    useState<AddFormSchemaType>(getNewCustomProps);

  const saveCustomProperties = () => {
    setNewCustomPropsAction((prev) => ({
      ...prev,
      ...itemsFormPropsValue,
    }));

    toast.success("Custom Properties Updated");

    setItemFormPropsValueAction((prev) =>
      prev.map((item) => ({
        ...item,
        ...itemsFormPropsValue,
        id: Math.random().toString(),
      }))
    );

    setOpenDialogAction(false);
  };

  return (
    <Credenza open={openDialog} onOpenChange={setOpenDialogAction}>
      <CredenzaContent className="sm:max-w-[600px]">
        <CredenzaHeader>
          <CredenzaTitle>Customize Issue Form Details</CredenzaTitle>
          <CredenzaDescription>
            Update the details of your issue group here. Click Save when you're
            done.
          </CredenzaDescription>
        </CredenzaHeader>
        <AddForm
          index={1}
          events={[]}
          rarities={rarities}
          defaultValues={getNewCustomProps}
          currentUser={currentUser}
          event={event}
          onFormChangeAction={(value, index) => {
            setItemsFormPropsValue((prev) => {
              const updatedValue = { ...prev, ...value };
              return updatedValue;
            });
          }}
          hiddenFields={["name", "image", "releaseDate", "eventId"]}
        />
        <CredenzaFooter className="flex flex-row justify-center">
          <Button
            variant="destructive"
            onClick={() => {
              setNewCustomPropsAction({
                ...getNewCustomProps,
                ...{
                  group: "",
                  era: "",
                  rarity: { level: 1, icon: "default" },
                },
              });

              setItemFormPropsValueAction((prev) =>
                prev.map((item) => ({
                  ...item,
                  ...{
                    group: "",
                    era: "",
                    rarity: { level: 1, icon: "default" },
                  },
                  id: Math.random().toString(),
                }))
              );

              toast.success("Custom Properties Deleted");
              setOpenDialogAction(false);
            }}
          >
            Delete
          </Button>
          <Button onClick={() => saveCustomProperties()}>Save changes</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
