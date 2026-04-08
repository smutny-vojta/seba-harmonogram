import { getNextTermOrder, listTerms } from "@/features/terms/dal";
import TermsMenu from "./components/TermsMenu";
import TermsGrid from "./components/TermsGrid";

export default async function TermsView() {
  const [terms, nextOrder] = await Promise.all([
    listTerms(),
    getNextTermOrder(),
  ]);

  return (
    <div className="flex h-full flex-col gap-y-4">
      <TermsMenu count={terms.length} nextOrder={nextOrder} />
      <TermsGrid terms={terms} />
    </div>
  );
}
