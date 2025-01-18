"use client";

import React, { JSX, useEffect, useState, type FC } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateInput } from "./date-input";
import { Label } from "./label";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

// Define Presets for Future Date Range
const PRESETS = [
  { name: "today", label: "Today" },
  { name: "tomorrow", label: "Tomorrow" },
  { name: "next3", label: "In 3 days" },
  { name: "next7", label: "In 1 week" },
  { name: "next14", label: "In 2 weeks" },
  { name: "next30", label: "In 1 month" },
  { name: "next3Months", label: "In 3 months" },
  { name: "next6Months", label: "In 6 months" },
  { name: "nextYear", label: "In 1 year" },
];

interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface DateRangePickerProps {
  onUpdate?: (values: { range: DateRange }) => void;
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  locale?: string;
  align?: "start" | "center" | "end";
}

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    const parts = dateInput.split("-").map((part) => parseInt(part, 10));
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return dateInput;
};

const formatDate = (date: Date, locale: string = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Date Range Picker Component
export const DateRangePicker: FC<DateRangePickerProps> = ({
  initialDateFrom = new Date(),
  initialDateTo,
  onUpdate,
  align = "end",
  locale = "en-US",
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  });

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined
  );

  // Set Preset Range
  const getPresetRange = (presetName: string): DateRange => {
    const from = new Date();
    const to = new Date();

    switch (presetName) {
      case "today":
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "tomorrow":
        from.setDate(from.getDate() + 1);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() + 1);
        to.setHours(23, 59, 59, 999);
        break;
      case "next3":
        from.setDate(from.getDate() + 3);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() + 3);
        to.setHours(23, 59, 59, 999);
        break;
      case "next7":
        from.setDate(from.getDate() + 7);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() + 7);
        to.setHours(23, 59, 59, 999);
        break;
      case "next14":
        from.setDate(from.getDate() + 14);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() + 14);
        to.setHours(23, 59, 59, 999);
        break;
      case "next30":
        from.setMonth(from.getMonth() + 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setMonth(to.getMonth() + 1);
        to.setDate(1);
        to.setHours(23, 59, 59, 999);
        break;
      case "next3Months":
        from.setMonth(from.getMonth() + 3);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setMonth(to.getMonth() + 3);
        to.setDate(1);
        to.setHours(23, 59, 59, 999);
        break;
      case "next6Months":
        from.setMonth(from.getMonth() + 6);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setMonth(to.getMonth() + 6);
        to.setDate(1);
        to.setHours(23, 59, 59, 999);
        break;
      case "nextYear":
        from.setFullYear(from.getFullYear() + 1);
        from.setMonth(0);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setFullYear(to.getFullYear() + 1);
        to.setMonth(0);
        to.setDate(1);
        to.setHours(23, 59, 59, 999);
        break;
    }

    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);
      const normalizedRangeFrom = new Date(range.from).setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(presetRange.from).setHours(
        0,
        0,
        0,
        0
      );

      const normalizedRangeTo = new Date(range.to ?? 0).setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(presetRange.to ?? 0).setHours(
        0,
        0,
        0,
        0
      );

      if (
        normalizedRangeFrom === normalizedPresetFrom &&
        normalizedRangeTo === normalizedPresetTo
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }
    setSelectedPreset(undefined);
  };

  useEffect(() => {
    checkPreset();
  }, [range]);

  // Handle Date Change
  const handleDateChange = (date: Date | undefined, isFrom: boolean) => {
    if (date) {
      if (isFrom) {
        setRange({
          ...range,
          from: date,
          to: range.to && date > range.to ? date : range.to,
        });
      } else {
        setRange({
          ...range,
          to: date,
          from: date < range.from ? date : range.from,
        });
      }
    }
  };

  // Preset Button Component
  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }) => (
    <Button
      className={cn(isSelected && "pointer-events-none")}
      variant="ghost"
      onClick={() => {
        setPreset(preset);
      }}
    >
      <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
        <CheckIcon width={18} height={18} />
      </span>
      {label}
    </Button>
  );

  return (
    // <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
    //   <PopoverTrigger asChild>
    //     <Button size={"lg"} variant="outline">
    //       <div className="flex items-center justify-between text-right">
    //         <div className="py-1">
    //           <div>{`${formatDate(range.from, locale)}${
    //             range.to != null ? " - " + formatDate(range.to, locale) : ""
    //           }`}</div>
    //         </div>
    //         <div className="-mr-2 scale-125 pl-1 opacity-60">
    //           {isOpen ? (
    //             <ChevronUpIcon width={24} />
    //           ) : (
    //             <ChevronDownIcon width={24} />
    //           )}
    //         </div>
    //       </div>
    //     </Button>
    //   </PopoverTrigger>
    <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button size={"lg"} variant="outline">
          <div className="flex items-center justify-between text-right">
            <div className="py-1">
              <div>{`${formatDate(range.from, locale)}${
                range.to != null ? " - " + formatDate(range.to, locale) : ""
              }`}</div>
            </div>
            <div className="-mr-2 scale-125 pl-1 opacity-60">
              {isOpen ? (
                <ChevronUpIcon width={24} />
              ) : (
                <ChevronDownIcon width={24} />
              )}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto max-w-md">
        <div className="flex flex-col items-start gap-2 py-4">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <PresetButton
                key={preset.name}
                preset={preset.name}
                label={preset.label}
                isSelected={selectedPreset === preset.name}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <DateInput
              value={range.from}
              onChange={(date) => handleDateChange(date, true)}
            />
            <div className="py-1">-</div>
            <DateInput
              value={range.to}
              onChange={(date) => handleDateChange(date, false)}
            />
          </div>
          <Calendar
            mode="range"
            onSelect={(value) =>
              value?.from && setRange({ from: value.from, to: value.to })
            }
            selected={range}
          />
        </div>
        <div className="flex justify-end gap-2 py-2 pr-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              onUpdate?.({ range });
            }}
          >
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";
