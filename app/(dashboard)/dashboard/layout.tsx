// import { getCurrentUser } from "@/lib/session";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
