import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();

  // Check if the 'from' date is within the last 24 hours
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    // If within the last 24 hours, return a string like "X hours ago" or "X minutes ago"
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    // If not within the last 24 hours, check if the year of the 'from' date is the same as the current year
    if (currentDate.getFullYear() === from.getFullYear()) {
      // If the years are the same, return a string in the format "MMM d" (e.g., "Jul 12")
      return formatDate(from, "MMM d");
    } else {
      // If the years are different, return a string in the format "MMM d, yyyy" (e.g., "Jul 12, 2022")
      return formatDate(from, "MMM d, yyyy");
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}
