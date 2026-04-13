import { redirect } from "next/navigation";
import { getCurrentFixedTerm, listFixedTerms } from "@/lib/terms";

export default async function GroupsPage() {
  const currentTerm = getCurrentFixedTerm();
  const fallbackTerm = listFixedTerms()[0];
  const targetTermKey = currentTerm?.termKey ?? fallbackTerm?.termKey;

  if (!targetTermKey) {
    return (
      <div className="text-muted-foreground text-sm">
        Turnusy nejsou nakonfigurované.
      </div>
    );
  }

  redirect(`/dashboard/groups/${targetTermKey}`);
}
