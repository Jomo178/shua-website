import ViewSidebar from "@/container/view/sidebar-view";

import {
  MultiSidebarProvider,
  SidebarInset,
} from "@/components/ui/multisidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "Dashboard",
  // themeColor: [
  //   { media: "(prefers-color-scheme: dark)", color: "#000000" },
  //   { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  // ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <MultiSidebarProvider>
        <SidebarProvider>
          <ViewSidebar />
          <SidebarInset>
            <Navbar sidebarToggle={<SidebarToggle hiddenOnMobile={false} />} />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </MultiSidebarProvider>
    </section>
  );
}
