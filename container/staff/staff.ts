import { AuthorizationType, Staff, StaffRole } from "@prisma/client";
import { z } from "zod";

import { toUpperCase } from "@/lib/utils";
import { TreeNode } from "@/components/ui/checkbox-tree";

export function getPermissionsTree(staff: Partial<Staff> = {}): TreeNode[] {
  const permissions = Object.values(AuthorizationType);

  const permissionsTree: TreeNode[] = [
    {
      id: "create",
      label: "Create",
      children: permissions.map((permission) => ({
        id: permission,
        label: toUpperCase(permission),
        defaultChecked: (staff.create || []).includes(permission),
      })),
    },
    {
      id: "edit",
      label: "Edit",
      children: permissions.map((permission) => ({
        id: permission,
        label: toUpperCase(permission),
        defaultChecked: (staff.edit || []).includes(permission),
      })),
    },
    {
      id: "delete",
      label: "Delete",
      children: permissions.map((permission) => ({
        id: permission,
        label: toUpperCase(permission),
        defaultChecked: (staff.delete || []).includes(permission),
      })),
    },
    {
      id: "handle",
      label: "Handle",
      children: permissions.map((permission) => ({
        id: permission,
        label: toUpperCase(permission),
        defaultChecked: (staff.handle || []).includes(permission),
      })),
    },
  ];
  return permissionsTree;
}

export const staffFormSchema = z.object({
  discordId: z.string().min(1, { message: "Discord ID is required!" }),
  role: z.nativeEnum(StaffRole, { message: "Role is required!" }),
  create: z.array(z.nativeEnum(AuthorizationType)).optional().default([]),
  edit: z.array(z.nativeEnum(AuthorizationType)).optional().default([]),
  delete: z.array(z.nativeEnum(AuthorizationType)).optional().default([]),
  handle: z.array(z.nativeEnum(AuthorizationType)).optional().default([]),
});

export type StaffFormSchemaType = z.infer<typeof staffFormSchema>;
