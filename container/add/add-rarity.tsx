"use client";

import { Dispatch, SetStateAction } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rarity, Staff } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addRarity } from "@/app/(dashboard)/dashboard/action";

import { rarityFormSchema, RarityFormSchemaType } from "../event/event";

interface AddRarityProps {
  currentUser: Staff;
  setRaritiesAction: Dispatch<SetStateAction<Rarity[]>>;
  isOpen: boolean;
  setIsOpenAction: Dispatch<SetStateAction<boolean>>;
}

export default function AddRarity({
  currentUser,
  setRaritiesAction,
  isOpen,
  setIsOpenAction,
}: AddRarityProps) {
  const form = useForm<RarityFormSchemaType>({
    resolver: zodResolver(rarityFormSchema),
    defaultValues: {
      name: "",
      icon: "",
      createdById: currentUser.id,
    },
  });

  const onSubmit = async (values: RarityFormSchemaType) => {
    setIsOpenAction(false);

    toast.promise(addRarity(values), {
      loading: "Adding Rarity...",
      success: (data) => {
        if (!data.rarity) return data.message;

        setRaritiesAction((prev) => [...(prev ?? []), data.rarity]);
        return data.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpenAction}>
      <CredenzaContent className="md:max-w-sm">
        <CredenzaHeader>
          <CredenzaTitle>Add Rarity</CredenzaTitle>
          <CredenzaDescription>
            Add new Rarity to the database.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form className="mx-auto max-w-3xl space-y-8 py-10">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription>The name of the rarity.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      The icon of the rarity. From discord emoji.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="destructive" onClick={() => setIsOpenAction(false)}>
            Close
          </Button>
          <Button onClick={() => form.handleSubmit(onSubmit)()}>
            Add Rarity
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
