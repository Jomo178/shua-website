import { Dispatch, SetStateAction } from "react";
import { StaffTableItems } from "@/container/staff/staff-columns";
import { Staff } from "@prisma/client";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    setDataAction: (data: StaffTableItems) => void;
    curentUser: Staff;
  }
}
