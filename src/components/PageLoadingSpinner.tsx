import { LucideLoader2 } from "lucide-react";

export function PageLoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <LucideLoader2 className="animate-spin" size={32} />
    </div>
  );
}
