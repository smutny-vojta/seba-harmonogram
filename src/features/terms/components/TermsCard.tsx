"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TermsDeleteDialog,
  TermsEditDialog,
} from "@/features/terms/components/TermsDialogs";
import type { TermItemType } from "@/features/terms/types";
import { formatPragueDateTime } from "@/lib/date-time/prague";

interface TermsCardProps {
  term: TermItemType;
}

export default function TermsCard({ term }: TermsCardProps) {
  const router = useRouter();

  return (
    <Card
      tabIndex={0}
      onClick={(event) => {
        const target = event.target as HTMLElement;

        if (target.closest('[data-stop-navigation="true"]')) {
          return;
        }

        router.push(`/dashboard/terms/${term.id}`);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/dashboard/terms/${term.id}`);
        }
      }}
      className={
        term.isActive
          ? "cursor-pointer border-l-8 border-emerald-500"
          : "border-border cursor-pointer border-l-8"
      }
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle>{term.name}</CardTitle>
          <p className="text-muted-foreground mt-1 text-xs">
            {term.isActive ? "Aktivní" : "Neaktivní"}
          </p>
        </div>
        <div className="flex gap-2" data-stop-navigation="true">
          <div data-stop-navigation="true">
            <TermsEditDialog term={term} />
          </div>
          <div data-stop-navigation="true">
            <TermsDeleteDialog id={term.id} name={term.name} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          <span className="text-muted-foreground">Začátek:</span>{" "}
          {formatPragueDateTime(term.startsAt)}
        </p>
        <p>
          <span className="text-muted-foreground">Konec:</span>{" "}
          {formatPragueDateTime(term.endsAt)}
        </p>
        <div className="space-y-1">
          {term.campCategoryCounts.map((campCategoryCount) => (
            <div
              key={campCategoryCount.campCategory}
              className="rounded-md border p-2"
            >
              <p className="truncate text-sm font-medium">
                {campCategoryCount.campName}
              </p>
              <p className="text-muted-foreground text-xs">
                Oddílů: {campCategoryCount.count}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
