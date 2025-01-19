"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Plus } from "lucide-react";

import { cn, toUpperCase } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Option = { value: string; label: string; image?: string };

interface SelectWithButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  options: Option[];
  title: string;
  onValueChangeAction: (option: Option) => void;
}

export default function SelectWithButton({
  options,
  title,
  onValueChangeAction,
  ...props
}: SelectWithButtonProps) {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<Option>();

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            <span
              className={cn(
                "flex items-center gap-4 truncate",
                !selectedValue?.value && "text-muted-foreground"
              )}
            >
              {selectedValue?.image && (
                <Image
                  src={selectedValue.image}
                  alt={selectedValue.value}
                  width={24}
                  height={24}
                />
              )}
              {selectedValue?.value
                ? options?.find(
                    (option) => option.value === selectedValue?.value
                  )?.label
                : `Select ${title}`}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Find ${title}`} />
            <CommandList>
              <CommandEmpty>No {title} found.</CommandEmpty>
              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setSelectedValue(
                        currentValue === selectedValue?.value
                          ? undefined
                          : (options.find(
                              (option) => option.value === currentValue
                            ) ?? undefined)
                      );
                      onValueChangeAction(option);
                      setOpen(false);
                    }}
                  >
                    {option?.image && (
                      <Image
                        src={option.image}
                        alt={option.value}
                        width={24}
                        height={24}
                      />
                    )}
                    {option.label}
                    {selectedValue?.value === option.value && (
                      <Check size={16} strokeWidth={2} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  {...props}
                >
                  <Plus
                    size={16}
                    strokeWidth={2}
                    className="-ms-2 me-2 opacity-60"
                    aria-hidden="true"
                  />
                  New {toUpperCase(title)}
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
