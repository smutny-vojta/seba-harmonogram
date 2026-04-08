import { type Collection, ObjectId } from "mongodb";
import type {
  NewTermType,
  TermItemType,
  TermType,
} from "@/features/terms/types";
import { formatPragueDateTimeInput } from "@/lib/date-time/prague";
import { mapMongoIdToId } from "@/utils/mongo";

type TermDateRange = {
  startsAt: Date;
  endsAt: Date;
  excludeId?: string;
};

// Helpers used in components/TermsDialogs.tsx

export function splitDateTimeValue(
  date: Date | undefined,
  fallbackTime: string,
) {
  if (!date) {
    return {
      date: "",
      time: fallbackTime,
    };
  }

  const value = formatPragueDateTimeInput(date);
  const [datePart, timePart] = value.split("T");

  if (!datePart || !timePart) {
    return {
      date: "",
      time: fallbackTime,
    };
  }

  return {
    date: datePart,
    time: timePart,
  };
}

export function buildDateTimeValue(date: string, time: string, label: string) {
  const safeDate = date.trim();
  const safeTime = time.trim();

  if (!safeDate || !safeTime) {
    throw new Error(`Vyplňte prosím datum i čas položky ${label}.`);
  }

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
    String(formData.get("startsAtTime") ?? ""),
    "začátek",
  );
  const endsAtValue = buildDateTimeValue(
    String(formData.get("endsAtDate") ?? ""),
    String(formData.get("endsAtTime") ?? ""),
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

// Helpers used in dal.ts
export async function assertNoTermOverlap(
  collection: Collection<TermType>,
  { startsAt, endsAt, excludeId }: TermDateRange,
) {
  const overlap = await collection.findOne({
    ...(excludeId ? { _id: { $ne: new ObjectId(excludeId) } } : {}),
    startsAt: { $lte: endsAt },
    endsAt: { $gte: startsAt },
  });

  if (overlap) {
    throw new Error("Turnusy se nesmí překrývat.");
  }
}

export async function assertTermBusinessRulesForDal(
  collection: Collection<TermType>,
  { startsAt, endsAt, excludeId }: TermDateRange,
  {
    hasExpectedFixedTimes,
    getExpectedEndFromStart,
  }: {
    hasExpectedFixedTimes: (startsAt: Date, endsAt: Date) => boolean;
    getExpectedEndFromStart: (startsAt: Date) => Date;
  },
) {
  if (!hasExpectedFixedTimes(startsAt, endsAt)) {
    throw new Error(
      "Turnus musí začínat v 14:00 a končit v 10:30 (čas Europe/Prague).",
    );
  }

  const expectedEnd = getExpectedEndFromStart(startsAt);

  if (expectedEnd.getTime() !== endsAt.getTime()) {
    throw new Error(
      "Turnus musí mít přesně 10 dní: od 1. dne 14:00 do 10. dne 10:30 (Europe/Prague).",
    );
  }

  await assertNoTermOverlap(collection, { startsAt, endsAt, excludeId });
}

export async function normalizeTermOrderByStart(
  collection: Collection<TermType>,
) {
  const terms = await collection.find().sort({ startsAt: 1 }).toArray();

  const operations = terms
    .map((term, index) => {
      const nextOrder = index + 1;

      if (term.order === nextOrder) {
        return null;
      }

      return {
        updateOne: {
          filter: { _id: term._id },
          update: { $set: { order: nextOrder } },
        },
      };
    })
    .filter((operation) => operation !== null);

  if (operations.length === 0) {
    return;
  }

  await collection.bulkWrite(operations);
}

export function mapTermToItem(term: TermType): TermItemType {
  const item = mapMongoIdToId(term);
  const now = new Date();

  return {
    ...item,
    name: `${item.order}. turnus`,
    isActive: item.startsAt <= now && now <= item.endsAt,
  };
}
