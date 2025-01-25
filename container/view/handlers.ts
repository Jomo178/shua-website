import {
  approveItems,
  deleteItems,
  editItems,
  rejectItems,
  resubmitRejectedItems,
} from "@/server/view-set-action";
import { parseAsJson, parseAsStringLiteral } from "nuqs/server";
import { toast } from "sonner";

import {
  EditItemsProps,
  ItemListingView,
  ItemsNameType,
  ItemStatusViewType,
} from "@/types/view";
import { toUpperCase } from "@/lib/utils";

import { IssueFilterPropsValue, IssueFilterSchema } from "./view";

export function usehandleApprovePendingItems<T extends ItemsNameType>(
  itemNameType: T,
  setViewTypeDataAction?: React.Dispatch<
    React.SetStateAction<ItemListingView<T>>
  >
) {
  const tableName = {
    issues: "pendingIssues",
  } as const;

  const handleApprovePendingItems = async (itemsIds: string[]) => {
    toast.promise(approveItems(itemsIds, tableName[itemNameType]), {
      loading: `Approving ${toUpperCase(itemNameType)}...`,
      success(data) {
        if (setViewTypeDataAction) {
          setViewTypeDataAction((prev) => ({
            ...prev,
            data: prev.data.filter((item) => !itemsIds.includes(item.id)),
            selectedItems: [],
          }));
        }
        return data.message;
      },
      error: `Failed to approve ${toUpperCase(itemNameType)}.`,
    });
  };

  const handleRejectPendingItems = async (
    itemsIds: string[],
    reason: string
  ) => {
    toast.promise(rejectItems(itemsIds, tableName[itemNameType], reason), {
      loading: `Rejecting ${toUpperCase(itemNameType)}...`,
      success(data) {
        if (setViewTypeDataAction) {
          setViewTypeDataAction((prev) => ({
            ...prev,
            data: prev.data.filter((item) => !itemsIds.includes(item.id)),
            selectedItems: [],
          }));
        }
        return data.message;
      },
      error: `Failed to reject ${toUpperCase(itemNameType)}.`,
    });
  };

  const handleResubmitRejectedItems = async (itemsIds: string[]) => {
    toast.promise(resubmitRejectedItems(itemsIds, tableName[itemNameType]), {
      loading: `Resubmitting ${toUpperCase(itemNameType)}...`,
      success(data) {
        if (setViewTypeDataAction) {
          setViewTypeDataAction((prev) => ({
            ...prev,
            data: prev.data.filter((item) => !itemsIds.includes(item.id)),
            selectedItems: [],
          }));
        }
        return data.message;
      },
      error: `Failed to resubmit ${toUpperCase(itemNameType)}.`,
    });
  };

  const handleEditItems = async ({
    itemsViewPortId,
    item,
  }: EditItemsProps<T>) => {
    toast.promise(editItems({ itemsViewPortId, item }), {
      loading: `Editing ${itemNameType}...`,
      success({ editedItem, message }) {
        if (setViewTypeDataAction && editedItem) {
          setViewTypeDataAction((prev) => ({
            ...prev,
            data: prev.data.map((items) =>
              items.id === editedItem?.id ? editedItem : items
            ),
            selectedItems: [],
          }));
        }
        return message;
      },
      error: `Failed to edit ${itemNameType}.`,
    });
  };

  const handleDeleteItems = async (
    itemsViewPortId: ItemStatusViewType<T>,
    items: { id: string; image: string }[],
    password: string
  ) => {
    toast.promise(deleteItems(itemsViewPortId, items, password), {
      loading: "Deleting...",
      success(data) {
        if (setViewTypeDataAction) {
          setViewTypeDataAction((prev) => ({
            ...prev,
            data: prev.data.filter(
              (prevData) => !items.map((item) => item.id).includes(prevData.id)
            ),
            selectedItems: [],
          }));
        }
        return data.message;
      },
      error: `Items were not deleted. Incorrect password.`,
    });
  };

  return {
    handleApprovePendingItems,
    handleRejectPendingItems,
    handleResubmitRejectedItems,
    handleEditItems,
    handleDeleteItems,
  };
}

export const containsFields = [
  "name",
  "era",
  "group",
  "code",
  "rarity",
  "eventId",
] as const;
export type ContainsFields = (typeof containsFields)[number];
export const dateFields = ["createdAt", "updatedAt", "approvedAt"] as const;
export const userFields = [
  "createdBy",
  "approvedBy",
  "rejectedBy",
  "resubmittedBy",
] as const;
export type UserFields = (typeof userFields)[number];
export const sortByFields = [...containsFields, ...dateFields] as const;
export const sortOrderFields = ["asc", "desc"] as const;

export const searchParams = {
  filters: parseAsJson(IssueFilterSchema.parse).withOptions({
    history: "push",
  }),
  sortBy: parseAsStringLiteral(sortByFields)
    .withDefault("createdAt")
    .withOptions({
      history: "push",
    }),
  sortOrder: parseAsStringLiteral(sortOrderFields)
    .withDefault("asc")
    .withOptions({
      history: "push",
    }),
};

export function constructWhereConditions(
  filters: IssueFilterPropsValue | null = {},
  staff: { id: string; discordId: string }[] = []
) {
  if (!filters) return {};

  const getIdsByDiscordIds = (discordIds: string[]) =>
    staff
      .filter((staff) => discordIds.includes(staff.discordId))
      .map((staff) => staff.id);

  const where = {
    ...(filters.createdBy
      ? { createdById: { in: getIdsByDiscordIds(filters.createdBy) } }
      : {}),
    ...(filters.rarity
      ? { rarity: { in: filters.rarity.map((value) => Number(value)) } }
      : {}),
    ...(filters.eventId ? { eventId: { in: filters.eventId } } : {}),
    ...(filters.approvedBy
      ? { approvedById: { in: getIdsByDiscordIds(filters.approvedBy) } }
      : {}),
    ...(filters.rejectedBy || filters.resubmittedBy
      ? {
          rejections: {
            some: {
              ...(filters.rejectedBy
                ? {
                    rejectedById: {
                      in: getIdsByDiscordIds(filters.rejectedBy),
                    },
                  }
                : {}),
              ...(filters.resubmittedBy
                ? {
                    resubmittedById: {
                      in: getIdsByDiscordIds(filters.resubmittedBy),
                    },
                  }
                : {}),
            },
          },
        }
      : {}),
  };

  const {
    approvedBy,
    rejectedBy,
    resubmittedBy,
    createdBy,
    rarity,
    eventId,
    ...remainingProps
  } = filters;

  return { ...remainingProps, ...where };
}

export function constructOrderByConditions(
  sortBy: string,
  sortOrder: string
): any {
  return {
    [sortBy]: sortOrder,
  };
}
