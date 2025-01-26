"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { archiveStaff } from "@/server/staff-action";
import { Staff } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import { toast } from "sonner";

import { hasPermission } from "@/lib/utils";
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
  currentUser,
}: {
  row: Row<StaffTableItems>;
  setDataAction: (data: StaffTableItems) => void;
  currentUser: Staff | undefined;
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
            <DropdownMenuItem
              disabled={
                currentUser ? hasPermission(currentUser, "edit:staff") : true
              }
              onClick={() => setModalOpen(true)}
            >
              <span>Edit</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                currentUser ? hasPermission(currentUser, "handle:staff") : true
              }
              onClick={() => {
                toast.promise(
                  archiveStaff(row.original.discordId, row.original.isInTeam),
                  {
                    loading: `${row.original.isInTeam ? "Archive" : "Unarchive"} staff...`,
                    success({ message }) {
                      setDataAction({
                        ...row.original,
                        isInTeam: !row.original.isInTeam,
                        status: row.original.isInTeam ? "Inactive" : "Active",
                        updatedAt: new Date(),
                      });
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
