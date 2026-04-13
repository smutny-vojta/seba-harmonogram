import { TermsGrid, TermsMenu } from "@/features/terms/components";
import { listTerms } from "@/features/terms/dal";

export default async function TermsView() {
  const terms = await listTerms();

  return (
    <div className="flex h-full flex-col gap-y-4">
      <TermsMenu count={terms.length} />
      <TermsGrid terms={terms} />
    </div>
  );
}
