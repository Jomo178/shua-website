import { notFound } from "next/navigation";
import StaffTable from "@/container/staff/staff-table";

import { getCurrentUser } from "@/lib/session";

import { getStaffAllInformation } from "../action";

export default async function Page() {
  const staffItems = await getStaffAllInformation();
  const getCurrentStaff = await getCurrentUser(true);
  if (!getCurrentStaff?.staff) return notFound();

  return (
    <div className="px-4 sm:px-6">
      <StaffTable staffItems={staffItems} currentUser={getCurrentStaff.staff} />
    </div>
  );
}
