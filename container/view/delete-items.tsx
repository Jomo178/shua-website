"use client";

import { useState } from "react";

import { ItemListingView, ItemsNameType, ItemType } from "@/types/view";
import { toUpperCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { PasswordInput } from "@/components/ui/input";

import { usehandleApprovePendingItems } from "./handlers";

interface DeleteIssuesProps<T extends ItemsNameType> {
  itemNameType: T;
  items: ItemType<T>[0][] | ItemType<T>[1][];
  viewPortType: ItemListingView<T>;
  setViewTypeDataAction?: React.Dispatch<
    React.SetStateAction<ItemListingView<T>>
  >;
  openDialog: boolean;
  setOpenDialogAction: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeleteItemsDialog<T extends ItemsNameType>({
  itemNameType,
  items,
  viewPortType,
  setViewTypeDataAction,
  openDialog,
  setOpenDialogAction,
}: DeleteIssuesProps<T>) {
  const { handleDeleteItems } = usehandleApprovePendingItems(
    itemNameType,
    setViewTypeDataAction
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (password === "") return setError("Password is required!");

    const response = await handleDeleteItems(
      viewPortType.id,
      items.map((item) => ({
        id: item.id,
        image: item.image,
      })),
      password
    );

    setError(response ?? "");
  };

  return (
    <Credenza open={openDialog} onOpenChange={setOpenDialogAction}>
      <CredenzaContent className="sm:max-w-[600px]">
        <CredenzaHeader>
          <CredenzaTitle>
            Delete Pending {toUpperCase(itemNameType)}
          </CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to delete the following {itemNameType}?
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <PasswordInput
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            autoComplete="new-password"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <ul className="mt-4">
            <li>{toUpperCase(itemNameType)} that will be deleted:</li>
            <div className="flex gap-4">
              {items.map((item) => (
                <li key={item.id}>
                  <p>{item.name}</p>
                </li>
              ))}
            </div>
          </ul>
        </CredenzaBody>

        <CredenzaFooter className="flex flex-row justify-center">
          <Button variant="outline" onClick={() => setOpenDialogAction(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
