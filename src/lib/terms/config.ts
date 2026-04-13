export type FixedTerm = {
  termKey: string;
  order: number;
  startsAt: Date;
  endsAt: Date;
};

export const FIXED_TERMS_2026: FixedTerm[] = [
  {
    termKey: "2026-t1",
    order: 1,
    startsAt: new Date(Date.UTC(2026, 6, 1, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 6, 10, 8, 30, 0, 0)),
  },
  {
    termKey: "2026-t2",
    order: 2,
    startsAt: new Date(Date.UTC(2026, 6, 10, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 6, 19, 8, 30, 0, 0)),
  },
  {
    termKey: "2026-t3",
    order: 3,
    startsAt: new Date(Date.UTC(2026, 6, 19, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 6, 28, 8, 30, 0, 0)),
  },
  {
    termKey: "2026-t4",
    order: 4,
    startsAt: new Date(Date.UTC(2026, 6, 28, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 7, 6, 8, 30, 0, 0)),
  },
  {
    termKey: "2026-t5",
    order: 5,
    startsAt: new Date(Date.UTC(2026, 7, 6, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 7, 15, 8, 30, 0, 0)),
  },
];

export function getFixedTermName(order: number): string {
  return `${order}. turnus`;
}

export function listFixedTerms(): FixedTerm[] {
  return [...FIXED_TERMS_2026];
}

export function getFixedTermByKey(termKey: string): FixedTerm | null {
  return FIXED_TERMS_2026.find((term) => term.termKey === termKey) ?? null;
}

export function getCurrentFixedTerm(
  referenceDate = new Date(),
): FixedTerm | null {
  return (
    FIXED_TERMS_2026.find(
      (term) => term.startsAt <= referenceDate && referenceDate <= term.endsAt,
    ) ?? null
  );
}
