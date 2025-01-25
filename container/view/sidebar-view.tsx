"use client";

import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { signOut } from "next-auth/react";

import { viewDashboard } from "@/config/sidebar";
import { cn, toUpperCase } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Icons } from "@/components/ui/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarToggle } from "@/components/ui/sidebar-toggle";

interface ViewSidebarProps {}

export default function ViewSidebar({}: ViewSidebarProps) {
  const { open } = useSidebar();
  const currentPath = usePathname();
  if (!currentPath) return notFound();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="flex h-16 shrink-0 items-center gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarToggle hiddenOnMobile={true} />

            <SidebarMenuButton className="h-10">
              <Icons.icon />
              <Breadcrumb>
                <BreadcrumbList className="!flex-nowrap">
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard/view">
                      {toUpperCase(currentPath.split("/", 3).pop() ?? "")}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      {toUpperCase(
                        viewDashboard
                          .find((item) =>
                            item.items.find(
                              (subItem) => subItem.href === currentPath
                            )
                          )
                          ?.items.find(
                            (subItem) => subItem.href === currentPath
                          )?.title ?? ""
                      )}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Action</SidebarGroupLabel>
          <SidebarMenu>
            {viewDashboard.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.href} prefetch={true}>
                      <item.Icon />
                      <p>{item.title}</p>
                    </Link>
                  </SidebarMenuButton>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent key={item.title}>
                    {item.items.map((subItem) => (
                      <SidebarMenuSub key={subItem.title}>
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            className="!ml-0 h-10"
                            asChild
                            isActive={currentPath === subItem.href}
                          >
                            <Link href={subItem.href} prefetch={true}>
                              <subItem.Icon />
                              <ul className="my-6 ml-1 list-disc [&>li]:mt-2">
                                {subItem.title}
                              </ul>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    ))}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut()}
              variant="outline"
              className={cn("h-10", open ? "justify-center" : "justify-normal")}
            >
              <Icons.signOut size={20} className="mr-2" />
              Sign out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
