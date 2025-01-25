import { generateItemsViewPort } from "@/container/view/view";
import { ViewDashboardType } from "@/types";

import { Icons } from "@/components/ui/icons";

export const viewDashboard: ViewDashboardType[] = [
  {
    title: "Issues",
    Icon: Icons.previewButton,
    href: "/dashboard/view/issues",
    isActive: true,
    items: generateItemsViewPort("issues"),
  },
  {
    title: "Manage",
    Icon: Icons.manage,
    href: "",
    isActive: true,
    items: [
      {
        title: "Add Issue",
        Icon: Icons.addIssue,
        href: "/dashboard/add/issues",
        disabled: false,
        description:
          "Create and add new issues to your team's database effortlessly.",
      },
      {
        title: "Manage Events",
        Icon: Icons.soon,
        href: "/dashboard/events",
        disabled: false,
        description:
          "Create, edit, and manage events to keep your team and community updated.",
      },
      {
        title: "Manage Staff",
        Icon: Icons.staff,
        href: "/dashboard/staff",
        disabled: false,
        description:
          "View and manage staff members, roles, and permissions effectively.",
      },
    ],
  },
  //   {
  //     title: "Menu",
  //     Icon: Icons.menu,
  //     href: "",
  //     isActive: false,
  //     items: dashboardActions,
  //   },
] as const;
