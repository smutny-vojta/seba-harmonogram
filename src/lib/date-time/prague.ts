const PRAGUE_TIME_ZONE = "Europe/Prague";

export type PragueDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const PRAGUE_PARTS_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: PRAGUE_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const PRAGUE_OFFSET_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: PRAGUE_TIME_ZONE,
  timeZoneName: "shortOffset",
});

export function getOffsetMinutesAtUtc(utcDate: Date): number {
  const offset = PRAGUE_OFFSET_FORMATTER.formatToParts(utcDate).find(
    (part) => part.type === "timeZoneName",
  )?.value;

  if (!offset || offset === "GMT") {
    return 0;
  }

  const match = offset.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);

  if (!match) {
    throw new Error("Nepodařilo se určit offset časové zóny Europe/Prague.");
  }

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? "0");

  return sign * (hours * 60 + minutes);
}

export function pragueLocalToUtc(parts: PragueDateParts): Date {
  const baseUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    0,
    0,
  );

  let utcMs = baseUtc;

  for (let i = 0; i < 3; i += 1) {
    const offsetMinutes = getOffsetMinutesAtUtc(new Date(utcMs));
    const nextUtcMs = baseUtc - offsetMinutes * 60_000;

    if (nextUtcMs === utcMs) {
      break;
    }

    utcMs = nextUtcMs;
  }

  return new Date(utcMs);
}

export function getPragueParts(date: Date): PragueDateParts {
  const parts = PRAGUE_PARTS_FORMATTER.formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((part) => part.type === type)?.value;

    if (!value) {
      throw new Error("Nepodařilo se načíst části data pro Europe/Prague.");
    }

    return Number(value);
  };

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

export function parsePragueDateTimeInput(value: string): Date {
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);

  if (!match) {
    throw new Error("Zadané datum a čas nejsou platné.");
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute)
  ) {
    throw new Error("Zadané datum a čas nejsou platné.");
  }

  const utc = pragueLocalToUtc({ year, month, day, hour, minute });

  if (Number.isNaN(utc.getTime())) {
    throw new Error("Zadané datum a čas nejsou platné.");
  }

  return utc;
}

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
