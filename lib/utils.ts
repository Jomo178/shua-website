import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUpperCase(text: string) {
  return text
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .replace(/^./, text[0]?.toUpperCase());
}

export const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function formatDistanceToNow(
  lastChanges: Date,
  options: { addSuffix: boolean }
): string {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - lastChanges.getTime()) / 1000
  );

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return options.addSuffix
        ? `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
        : `${count} ${interval.label}${count > 1 ? "s" : ""}`;
    }
  }

  return "just now";
}
