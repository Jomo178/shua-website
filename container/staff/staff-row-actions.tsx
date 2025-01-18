"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { archiveStaff } from "@/server/staff-action";
import { Row } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { StaffEdit } from "./staff-actions";
import { StaffTableItems } from "./staff-columns";

export function RowActions({
  row,
  setDataAction,
}: {
  row: Row<StaffTableItems>;
  setDataAction: Dispatch<SetStateAction<StaffTableItems[]>>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button
              size="icon"
              variant="ghost"
              className="shadow-none"
              aria-label="Edit item"
            >
              <Ellipsis size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setModalOpen(true)}>
              <span>Edit</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                toast.promise(
                  archiveStaff(row.original.discordId, row.original.isInTeam),
                  {
                    loading: `${row.original.isInTeam ? "Archive" : "Unarchive"} staff...`,
                    success({ message }) {
                      setDataAction((prevData) =>
                        prevData.map((staff) => {
                          if (staff.discordId === row.original.discordId) {
                            return {
                              ...staff,
                              isInTeam: !staff.isInTeam,
                              status: staff.isInTeam ? "Inactive" : "Active",
                              updatedAt: new Date(),
                            };
                          }
                          return staff;
                        })
                      );
                      return message;
                    },
                    error: "Failed to archive staff.",
                  }
                );
              }}
            >
              <span>{row.original.isInTeam ? "Archive" : "Unarchive"}</span>
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <StaffEdit
        isOpen={modalOpen}
        setIsOpenAction={setModalOpen}
        staffInformation={row.original}
        setDataAction={setDataAction}
      />
    </>
  );
}
