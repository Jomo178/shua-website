"use client";

import { Dispatch, SetStateAction } from "react";
import { addStaff, editStaff } from "@/server/staff-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { staffFormSchema, StaffFormSchemaType } from "./staff";
import { StaffTableItems } from "./staff-columns";
import StaffForm from "./staff-form";

interface StaffAddProps {
  setDataAction: Dispatch<SetStateAction<StaffTableItems[]>>;
  isOpen: boolean;
  setIsOpenAction: Dispatch<SetStateAction<boolean>>;
}

export function StaffAdd({
  setDataAction,
  isOpen,
  setIsOpenAction,
}: StaffAddProps) {
  const form = useForm<StaffFormSchemaType>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      discordId: "",
      create: [],
      edit: [],
      delete: [],
      handle: [],
    },
  });

  function onSubmit(values: StaffFormSchemaType) {
    setIsOpenAction(false);

    toast.promise(addStaff(values), {
      loading: "Adding staff...",
      success({ message, staff }) {
        form.reset();
        if (!staff) return message;
        setDataAction((prevData) => [
          ...prevData,
          {
            ...values,
            id: crypto.randomUUID(),
            image: staff.avatar,
            name: staff.username,
            global_name: staff.global_name,
            email: "Not Provided",
            isInTeam: true,
            status: "Active",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        return message;
      },
      error: "Failed to add staff.",
    });
  }

  return (
    <StaffForm
      form={form}
      onSubmit={onSubmit}
      title="Add Staff"
      isOpen={isOpen}
      setIsOpenAction={setIsOpenAction}
    />
  );
}

interface StaffEditProps {
  staffInformation: StaffTableItems;
  setDataAction: Dispatch<SetStateAction<StaffTableItems[]>>;
  isOpen: boolean;
  setIsOpenAction: Dispatch<SetStateAction<boolean>>;
}

export function StaffEdit({
  isOpen,
  setIsOpenAction,
  setDataAction,
  staffInformation,
}: StaffEditProps) {
  const form = useForm<StaffFormSchemaType>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      discordId: staffInformation.discordId,
      role: staffInformation.role,
      create: staffInformation.create,
      edit: staffInformation.edit,
      delete: staffInformation.delete,
      handle: staffInformation.handle,
    },
  });

  function onSubmit(values: StaffFormSchemaType) {
    setIsOpenAction(false);
    console.log(values);

    toast.promise(editStaff(values), {
      loading: "Editing staff...",
      success({ message, staff }) {
        form.reset();
        setDataAction((prevData) =>
          prevData.map((staff) => {
            if (staff.discordId === values.discordId) {
              return {
                ...values,
                id: staff.id,
                image: staff.image,
                name: staff.name,
                global_name: staff.global_name,
                email: staff.email,
                isInTeam: staff.isInTeam,
                status: staff.status,
                createdAt: staff.createdAt,
                updatedAt: new Date(),
              };
            }
            return staff;
          })
        );
        return message;
      },
      error: "Failed to edit staff.",
    });
  }

  return (
    <StaffForm
      form={form}
      onSubmit={onSubmit}
      title="Edit Staff"
      isOpen={isOpen}
      setIsOpenAction={setIsOpenAction}
    />
  );
}
