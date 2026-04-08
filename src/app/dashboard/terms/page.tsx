import { LucideLoader2 } from "lucide-react";
import { Suspense } from "react";
import TermsView from "@/features/terms/TermsView";

export default async function TermsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <LucideLoader2 className="animate-spin" size={32} />
        </div>
      }
    >
      <TermsView />
    </Suspense>
  );
}
