"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { addStaff } from "@/server/staff-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthorizationType, StaffRole } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { cn, toUpperCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxTree, TreeNode } from "@/components/ui/checkbox-tree";
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getPermissionsTree,
  staffFormSchema,
  StaffFormSchemaType,
} from "./staff";
import { StaffTableItems } from "./staff-columns";

interface StaffAddProps {
  setDataAction: Dispatch<SetStateAction<StaffTableItems[]>>;
  isOpen: boolean;
  setIsOpenAction: Dispatch<SetStateAction<boolean>>;
}

export default function StaffAdd({
  setDataAction,
  isOpen,
  setIsOpenAction,
}: StaffAddProps) {
  const form = useForm<StaffFormSchemaType>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      discordId: "",
      create: [],
      edit: [],
      delete: [],
      handle: [],
    },
  });

  const roles = Object.values(StaffRole);
  const permissionsTree = getPermissionsTree();

  function onSubmit(values: StaffFormSchemaType) {
    setIsOpenAction(false);

    toast.promise(addStaff(values), {
      loading: "Adding staff...",
      success({ message, staff }) {
        form.reset();
        if (!staff) return message;
        setDataAction((prevData) => [
          ...prevData,
          {
            ...values,
            id: crypto.randomUUID(),
            image: staff.avatar,
            name: staff.username,
            global_name: staff.global_name,
            email: "Not Provided",
            isInTeam: true,
            status: "Active",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        return message;
      },
      error: "Failed to add staff.",
    });
  }

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpenAction}>
      <CredenzaContent className="md:max-w-sm">
        <CredenzaHeader>
          <CredenzaTitle>Add New Staff</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <Form {...form}>
            <form className="mx-auto max-w-3xl space-y-8 py-10">
              <FormField
                control={form.control}
                name="discordId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord ID</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                      Add the unique Discord ID of the staff member.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the staff role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {toUpperCase(role)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the role for the staff member.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Permissions</FormLabel>
                <FormDescription>
                  Select the permissions for the staff member.
                </FormDescription>
                <div className="grid grid-cols-4">
                  {permissionsTree.map((node) => (
                    <FormField
                      control={form.control}
                      name={node.id as "create" | "edit" | "delete" | "handle"}
                      key={node.id}
                      render={({ field }) => (
                        <FormItem>
                          <TreeCheckBox
                            initialTree={node}
                            onValueChanged={(nodeId, checked) => {
                              const permissions = field.value ?? [];
                              if (checked && nodeId === node.id) {
                                form.setValue(
                                  field.name,
                                  node?.children?.map(
                                    (child) => child.id as AuthorizationType
                                  ) ?? []
                                );
                              } else if (!checked && nodeId === node.id) {
                                form.setValue(field.name, []);
                              }

                              if (checked && nodeId !== node.id) {
                                form.setValue(field.name, [
                                  ...permissions,
                                  nodeId,
                                ]);
                                return;
                              } else if (!checked && nodeId !== node.id) {
                                form.setValue(
                                  field.name,
                                  form
                                    .getValues(field.name)
                                    .filter(
                                      (permission: AuthorizationType) =>
                                        permission !== nodeId
                                    )
                                );
                              }
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </form>
          </Form>
        </CredenzaBody>
        <CredenzaFooter>
          <Button variant="destructive" onClick={() => setIsOpenAction(false)}>
            Close
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>Add Staff</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}

function TreeCheckBox({
  initialTree,
  onValueChanged,
}: {
  initialTree: TreeNode;
  onValueChanged?: (nodeId: AuthorizationType, checked: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <CheckboxTree
        tree={initialTree}
        renderNode={({ node, isChecked, onCheckedChange, children }) => (
          <Fragment key={node.id}>
            <div className="flex items-center">
              {node.children ? (
                <Button
                  type="button"
                  className="group ml-2 h-6 w-6 border-0 p-0"
                  variant="outline"
                  onClick={() => setOpen((prevState) => !prevState)}
                  aria-expanded={open}
                  aria-label={open ? "Close menu" : "Open menu"}
                >
                  <svg
                    className="pointer-events-none"
                    width={11}
                    height={11}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 [transition-timing-function:cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              ) : null}
              <Checkbox
                className="mr-2"
                id={node.id}
                checked={isChecked}
                onCheckedChange={(checked) => {
                  onCheckedChange();
                  if (onValueChanged) {
                    onValueChanged(
                      node.id as AuthorizationType,
                      checked === "indeterminate" ? true : checked
                    );
                  }
                }}
              />
              <Label htmlFor={node.id}>{node.label}</Label>
            </div>
            {children && (
              <div
                className={cn(
                  "ms-6 space-y-3 transition-all duration-300",
                  open ? "max-h-screen opacity-100" : "hidden max-h-0 opacity-0"
                )}
              >
                {children}
              </div>
            )}
          </Fragment>
        )}
      />
    </div>
  );
}
