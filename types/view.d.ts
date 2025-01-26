import { AddFormSchemaType } from "@/container/add/add";
import { ItemsType } from "@prisma/client";

import {
  IssuesWithRelation,
  PendingIssuesWithRelation,
} from "./prisma-relations";

export type ItemsNameType = `${ItemsType}`;

export type AuthorizationAction = "create" | "edit" | "delete" | "handle";

export type ItemsPendingType = `pending${Capitalize<ItemsNameType>}`;

type RelationMapping = {
  issues: [IssuesWithRelation, PendingIssuesWithRelation];
};

export type ItemStatusViewType<T extends ItemsNameType> =
  | `missing-${T}`
  | `released-${T}`
  | `pending-${T}`
  | `rejected-${T}`
  | `upcoming-${T}`;

export type ItemType<T extends keyof RelationMapping> = RelationMapping[T];

export interface ItemDetails {
  title: string;
  description: string;
  noteDescription?: string;
  fetchCount: number;
  Icon: FC<{ className: string }>;
  disabled: boolean;
}

export interface ItemListingView<T extends keyof RelationMapping>
  extends ItemDetails {
  id: ItemStatusViewType<T>;
  fetchFunction: (
    skip: number,
    amount: number,
    filter: any,
    orderBy: any
  ) => Promise<ItemType<T>[0][] | ItemType<T>[1][]>;
  data: ItemType<T>[0][] | ItemType<T>[1][];
  selectedItems: ItemType<T>[0][] | ItemType<T>[1][];
  href: `/dashboard/view/${ItemStatusViewType<T>}`;
}

export type EditItemsProps<T extends ItemsNameType> = {
  itemsViewPortId: ItemStatusViewType<T>;
  item: AddFormSchemaType & {
    imageLink: string;
    changedImage: boolean;
  };
};
