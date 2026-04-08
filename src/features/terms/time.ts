import {
  TERM_DURATION_DAYS,
  TERM_END_HOUR,
  TERM_END_MINUTE,
  TERM_START_HOUR,
  TERM_START_MINUTE,
} from "@/features/terms/consts";
import { getPragueParts, pragueLocalToUtc } from "@/lib/date-time/prague";

export function getExpectedEndFromStart(startAt: Date): Date {
  const start = getPragueParts(startAt);

  return pragueLocalToUtc({
    year: start.year,
    month: start.month,
    day: start.day + (TERM_DURATION_DAYS - 1),
    hour: TERM_END_HOUR,
    minute: TERM_END_MINUTE,
  });
}

export function getExpectedStartFromPreviousEnd(previousEndAt: Date): Date {
  const end = getPragueParts(previousEndAt);

  return pragueLocalToUtc({
    year: end.year,
    month: end.month,
    day: end.day,
    hour: TERM_START_HOUR,
    minute: TERM_START_MINUTE,
  });
}

export function hasExpectedFixedTimes(startAt: Date, endAt: Date): boolean {
  const start = getPragueParts(startAt);
  const end = getPragueParts(endAt);

  return (
    start.hour === TERM_START_HOUR &&
    start.minute === TERM_START_MINUTE &&
    end.hour === TERM_END_HOUR &&
    end.minute === TERM_END_MINUTE
  );
}
