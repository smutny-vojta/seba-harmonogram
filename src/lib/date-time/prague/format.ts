import { getPragueParts, PRAGUE_TIME_ZONE } from "./convert";

export function formatPragueDateTimeInput(date: Date | undefined): string {
  if (!date) {
    return "";
  }

  const parts = getPragueParts(date);

  return `${parts.year.toString().padStart(4, "0")}-${parts.month
    .toString()
    .padStart(2, "0")}-${parts.day.toString().padStart(2, "0")}T${parts.hour
    .toString()
    .padStart(2, "0")}:${parts.minute.toString().padStart(2, "0")}`;
}

export function formatPragueDateTime(date: Date): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    timeZone: PRAGUE_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatPragueDate(date: Date): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    timeZone: PRAGUE_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
