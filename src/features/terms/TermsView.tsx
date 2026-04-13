import { listTerms } from "@/features/terms/dal";
import TermsGrid from "./components/TermsGrid";
import TermsMenu from "./components/TermsMenu";

export default async function TermsView() {
  const terms = await listTerms();

  return (
    <div className="flex h-full flex-col gap-y-4">
      <TermsMenu count={terms.length} />
      <TermsGrid terms={terms} />
    </div>
  );
}
