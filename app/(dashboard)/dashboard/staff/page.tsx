import { revalidatePath } from "next/cache";
import StaffTable from "@/container/staff/staff-table";

import { getStaffAllInformation } from "../action";

export default async function Page() {
  const staffItems = await getStaffAllInformation();

  console.log(staffItems);

  return (
    <div className="px-4 sm:px-6">
      <StaffTable staffItems={staffItems}></StaffTable>
    </div>
  );
}
