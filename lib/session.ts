import { getServerSession } from "next-auth/next";

import { authOptions } from "./authOptions";

export async function getCurrentUser(isStaff = false) {
  const session = await getServerSession(authOptions);

  return session?.user;
}
