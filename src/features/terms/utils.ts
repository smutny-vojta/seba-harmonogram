import type { NewTermType } from "@/features/terms/types";
import {
  TERM_END_HOUR,
  TERM_END_MINUTE,
  TERM_START_HOUR,
  TERM_START_MINUTE,
} from "@/features/terms/consts";

// Helpers used in components/TermsDialogs.tsx

function toTwoDigits(value: number): string {
  return value.toString().padStart(2, "0");
}

export function buildDateTimeValue(
  date: string,
  hour: number,
  minute: number,
  label: string,
) {
  const safeDate = date.trim();

  if (!safeDate) {
    throw new Error(`Vyplňte prosím datum položky ${label}.`);
  }

  const safeTime = `${toTwoDigits(hour)}:${toTwoDigits(minute)}`;

  return `${safeDate}T${safeTime}`;
}

export function formatRangeLabel(from: string, to: string) {
  if (!from || !to) {
    return "Vyberte rozsah";
  }

  return `${from.split("-").reverse().join(".")} - ${to
    .split("-")
    .reverse()
    .join(".")}`;
}

export function dateToInputValue(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Prague",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

export function inputValueToDate(value: string): Date | undefined {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

export function parseTermFormData(
  formData: FormData,
  parseDateTimeInput: (value: string) => Date,
): NewTermType {
  const startsAtValue = buildDateTimeValue(
    String(formData.get("startsAtDate") ?? ""),
    TERM_START_HOUR,
    TERM_START_MINUTE,
    "začátek",
  );
  const endsAtValue = buildDateTimeValue(
    String(formData.get("endsAtDate") ?? ""),
    TERM_END_HOUR,
    TERM_END_MINUTE,
    "konec",
  );

  const startsAt = parseDateTimeInput(startsAtValue);
  const endsAt = parseDateTimeInput(endsAtValue);

  if (endsAt < startsAt) {
    throw new Error(
      "Datum konce musí být stejné nebo pozdější než datum začátku.",
    );
  }

  return {
    startsAt,
    endsAt,
  };
}

export function extractActionErrorReason(errorPayload: unknown): string {
  if (typeof errorPayload !== "object" || errorPayload === null) {
    return "Neznámý důvod chyby.";
  }

  const maybeError = errorPayload as {
    error?: {
      serverError?: string;
    };
  };

  const reason = maybeError.error?.serverError;

  if (typeof reason === "string" && reason.trim().length > 0) {
    return reason;
  }

  return "Neznámý důvod chyby.";
}
