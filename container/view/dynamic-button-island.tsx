"use client";

import { useState } from "react";
import { Staff } from "@prisma/client";

import { ItemListingView, ItemsNameType } from "@/types/view";
import { cn, hasPermission } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import DeleteItemsDialog from "./delete-items";
import { usehandleApprovePendingItems } from "./handlers";
import { RejectionsDialog } from "./view-item-card";

interface DynamicButtonIslandProps<T extends ItemsNameType> {
  itemNameType: T;
  viewPort: ItemListingView<T>;
  setViewPortAction: React.Dispatch<React.SetStateAction<ItemListingView<T>>>;
  currentUser: Staff;
  setOpenSidebarAction: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DynamicButtonIsland<T extends ItemsNameType>({
  itemNameType,
  viewPort,
  setViewPortAction,
  currentUser,
  setOpenSidebarAction,
}: DynamicButtonIslandProps<T>) {
  const [openIsland, setOpenIsland] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {
    handleApprovePendingItems,
    handleRejectPendingItems,
    handleResubmitRejectedItems,
  } = usehandleApprovePendingItems(itemNameType, setViewPortAction);

  const disableButton = viewPort.selectedItems.length == 0;

  const checkForAllowness = viewPort.id.includes("rejected") || disableButton;

  const issueCreatedByUser = viewPort.selectedItems.some(
    (item) => item.createdBy?.id === currentUser.id
  );

  const AllOrSelected =
    viewPort.selectedItems.length == viewPort.data.length ? "All" : "Selected";
  return (
    <div
      className={cn(
        "fixed bottom-7 left-[50%] z-50 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary p-3 font-mono text-xs transition-all duration-300",
        openIsland ? "h-14 w-fit -translate-x-1/2" : "w-10"
      )}
    >
      <Icons.info
        className={cn(openIsland ? "hidden" : "block cursor-pointer")}
        onClick={() => setOpenIsland(true)}
      />
      <div
        className={cn(
          "hidden flex-row items-center opacity-0 transition-opacity duration-1000",
          openIsland ? "flex opacity-100" : ""
        )}
      >
        <TooltipProvider delayDuration={200} disableHoverableContent>
          <Tooltip>
            <TooltipTrigger
              className={buttonVariants({ variant: "ghost" })}
              onClick={() => setOpenIsland(false)}
            >
              <Icons.cancel strokeWidth={2} size={24} />
            </TooltipTrigger>
            <TooltipContent className="bg-background">
              <p>Close Island</p>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger
              className={buttonVariants({ variant: "ghost" })}
              disabled={disableButton}
              onClick={() =>
                setViewPortAction((prev) => ({
                  ...prev,
                  selectedItems: [],
                }))
              }
            >
              <Icons.deselect strokeWidth={2} size={24} />
            </TooltipTrigger>
            <TooltipContent className="bg-background">
              <p>Deselect {AllOrSelected}</p>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6" />
          <Tooltip>
            <TooltipTrigger
              className={buttonVariants({ variant: "ghost" })}
              disabled={viewPort.selectedItems.length == viewPort.data.length}
              onClick={() =>
                setViewPortAction((prev) => ({
                  ...prev,
                  selectedItems: prev.data,
                }))
              }
            >
              <Icons.select size={20} />
            </TooltipTrigger>
            <TooltipContent className="bg-background">
              <p>Select All</p>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="h-6" />
          <Tooltip>
            <TooltipTrigger
              className={buttonVariants({ variant: "ghost" })}
              disabled={disableButton}
              onClick={() => setOpenSidebarAction((prev) => !prev)}
            >
              <Icons.info size={20} />
            </TooltipTrigger>
            <TooltipContent className="bg-background">
              <p>Show Information</p>
            </TooltipContent>
          </Tooltip>
          {viewPort.id.includes("pending") && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Tooltip>
                <TooltipTrigger
                  className={buttonVariants({ variant: "ghost" })}
                  disabled={
                    checkForAllowness ||
                    issueCreatedByUser ||
                    hasPermission(currentUser, `handle:${itemNameType}`)
                  }
                  onClick={() =>
                    handleApprovePendingItems([
                      viewPort.selectedItems[0]?.id,
                      ...viewPort.selectedItems.slice(1).map((item) => item.id),
                    ])
                  }
                >
                  <Icons.approve size={20} />
                </TooltipTrigger>
                <TooltipContent className="bg-background">
                  <p>Approve {AllOrSelected}</p>
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-6" />
              <Tooltip>
                <TooltipTrigger
                  className={buttonVariants({ variant: "ghost" })}
                  disabled={
                    checkForAllowness ||
                    issueCreatedByUser ||
                    hasPermission(currentUser, `handle:${itemNameType}`)
                  }
                  onClick={() => setOpenRejectDialog(true)}
                >
                  <Icons.rejected size={20} />
                </TooltipTrigger>
                <TooltipContent className="bg-background">
                  <p>Reject {AllOrSelected}</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
          {viewPort.id.includes("rejected") && (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Tooltip>
                <TooltipTrigger
                  className={buttonVariants({ variant: "ghost" })}
                  disabled={
                    disableButton ||
                    hasPermission(currentUser, `handle:${itemNameType}`)
                  }
                  onClick={() =>
                    handleResubmitRejectedItems([
                      viewPort.selectedItems[0]?.id,
                      ...viewPort.selectedItems.slice(1).map((item) => item.id),
                    ])
                  }
                >
                  <Icons.filter size={20} />
                </TooltipTrigger>
                <TooltipContent className="bg-background">
                  <p>Resubmit {AllOrSelected}</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
          <Separator orientation="vertical" className="h-6" />
          <Tooltip>
            <TooltipTrigger
              className={buttonVariants({ variant: "ghost" })}
              disabled={
                disableButton ||
                hasPermission(currentUser, `delete:${itemNameType}`)
              }
              onClick={() => setOpenDeleteDialog(true)}
            >
              <Icons.deleteButton size={20} />
            </TooltipTrigger>
            <TooltipContent className="bg-background">
              <p>Delete {AllOrSelected}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <RejectionsDialog
        itemNameType={itemNameType}
        pendingItem={viewPort.selectedItems.map((item) => ({
          id: item.id,
          name: item.name,
        }))}
        handleRejectPendingItemsAction={handleRejectPendingItems}
        openDialog={openRejectDialog}
        setOpenDialogAction={setOpenRejectDialog}
      />

      <DeleteItemsDialog
        itemNameType={itemNameType}
        items={viewPort.selectedItems}
        setViewTypeDataAction={setViewPortAction}
        viewPortType={viewPort}
        openDialog={openDeleteDialog}
        setOpenDialogAction={setOpenDeleteDialog}
      />
    </div>
  );
}
