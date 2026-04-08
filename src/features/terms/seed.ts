import { createTerm, pruneTerms } from "@/features/terms/dal";
import type { NewTermType } from "@/features/terms/types";

const TERM_TEMPLATES: NewTermType[] = [
  {
    startsAt: new Date(Date.UTC(2026, 6, 1, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 6, 10, 8, 30, 0, 0)),
  },
  {
    startsAt: new Date(Date.UTC(2026, 6, 10, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 6, 19, 8, 30, 0, 0)),
  },
  {
    startsAt: new Date(Date.UTC(2026, 6, 19, 12, 0, 0, 0)),
    endsAt: new Date(Date.UTC(2026, 6, 28, 8, 30, 0, 0)),
  },
];

export async function seedTermsFeature(options?: { prune?: boolean }) {
  if (options?.prune) {
    await pruneTerms();
    console.log("Stará data turnusů byla smazána (prune).");
  }

  for (const [i, term] of TERM_TEMPLATES.entries()) {
    try {
      await createTerm(term);
      console.log(`Vytvořen turnus ${i + 1}/${TERM_TEMPLATES.length}`);
    } catch (error) {
      console.error(
        `Chyba při vytváření turnusu ${i + 1}/${TERM_TEMPLATES.length}`,
      );
      console.error(error);
    }
  }
}
