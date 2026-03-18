import { db } from "@/shared/lib/db";
import { group } from "@/schema/camp";
import { term } from "@/schema/camp";
import { desc, asc } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Group DAL
// ---------------------------------------------------------------------------

export const groupDal = {
  listGroups: async () => {
    return await db.query.group.findMany({
      with: {
        term: true,
        campCategory: true,
      },
      orderBy: [desc(group.createdAt)],
    });
  },
};

// ---------------------------------------------------------------------------
// Term DAL
// ---------------------------------------------------------------------------

/**
 * Vrátí aktivní turnus na základě aktuálního data.
 * Turnus je aktivní, pokud startDate <= now <= endDate.
 * Pokud žádný turnus neodpovídá, vrátí null.
 */
export async function getActiveTerm() {
  const now = new Date();

  const terms = await getAllTerms();

  return (
    terms.find((t) => {
      const start = new Date(t.startDate);
      const end = new Date(t.endDate);
      return now >= start && now <= end;
    }) ?? null
  );
}

/**
 * Vrátí všechny turnusy seřazené podle ID.
 */
export async function getAllTerms() {
  return db.select().from(term).orderBy(asc(term.id));
}
