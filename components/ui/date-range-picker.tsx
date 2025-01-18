"use client";

import React, { JSX, useEffect, useState, type FC } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { DateInput } from "./date-input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface DateRangePickerProps {
  onUpdate?: (values: { range: DateRange }) => void;
  initialDateFrom?: Date | string;
  initialDateTo?: Date | string;
  disabledRange?: Matcher | Matcher[];
  locale?: string;
  align?: "start" | "center" | "end";
  className?: string;
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
  disabledRange,
  onUpdate,
  align = "end",
  locale = "en-US",
  className,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  });

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 960 : false
  );

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined
  );

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

  const resetValues = (): void => {
    setRange({
      from:
        typeof initialDateFrom === "string"
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === "string"
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === "string"
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
    });
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button size={"lg"} variant="outline" className={cn(className)}>
          <div className="text-right">
            <div className="py-1">
              <div>{`${formatDate(range.from, locale)}${
                range.to != null ? " - " + formatDate(range.to, locale) : ""
              }`}</div>
            </div>
          </div>
          <div className="-mr-2 scale-125 pl-1 opacity-60">
            {isOpen ? (
              <ChevronUpIcon width={24} />
            ) : (
              <ChevronDownIcon width={24} />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto">
        <div className="flex">
          <Calendar
            mode="range"
            onSelect={(value: { from?: Date; to?: Date } | undefined) => {
              if (value?.from != null) {
                setRange({ from: value.from, to: value?.to });
              }
            }}
            selected={range}
            numberOfMonths={isSmallScreen ? 1 : 2}
            disabled={disabledRange}
            defaultMonth={
              new Date(
                new Date().setMonth(
                  new Date().getMonth() - (isSmallScreen ? 0 : 1)
                )
              )
            }
          />
        </div>
        <div className="flex flex-col justify-end gap-2 pr-4 md:flex-row">
          <div className="flex flex-col items-center justify-center gap-2 pb-5 pr-4 lg:flex-row lg:items-start lg:pb-0">
            <div className="flex flex-col gap-2">
              <div className="just flex gap-2">
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
            </div>
          </div>
          <div className="flex flex-col-reverse justify-center gap-2 md:flex-row">
            <Button
              onClick={() => {
                setIsOpen(false);
                resetValues();
              }}
              variant="ghost"
            >
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
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";
