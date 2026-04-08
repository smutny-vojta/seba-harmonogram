import TermsContent from "@/features/terms/components/TermsContent";
import { getNextTermOrder, listTerms } from "@/features/terms/dal";

export default async function TermsView() {
  const [terms, nextOrder] = await Promise.all([
    listTerms(),
    getNextTermOrder(),
  ]);

  return (
    <div className="flex h-full flex-col gap-y-4">
      <TermsContent terms={terms} nextOrder={nextOrder} />
    </div>
  );
}
