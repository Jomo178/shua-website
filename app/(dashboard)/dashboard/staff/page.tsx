import StaffTable from "@/container/staff/staff-table";

import { getStaffAllInformation } from "../action";

export default async function Page() {
  const staffItems = await getStaffAllInformation();

  return (
    <div className="px-4 sm:px-6">
      <StaffTable staffItems={staffItems}></StaffTable>
    </div>
  );
}
