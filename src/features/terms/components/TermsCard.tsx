"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TermItemType } from "@/features/terms/types";
import { formatPragueDate } from "@/lib/date-time/prague";

interface TermsCardProps {
  term: TermItemType;
}

export default function TermsCard({ term }: TermsCardProps) {
  const router = useRouter();

  return (
    <Card
      tabIndex={0}
      onClick={() => {
        router.push(`/dashboard/groups/${term.id}`);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/dashboard/groups/${term.id}`);
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
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>
          <span className="text-muted-foreground">Datum:</span>{" "}
          {formatPragueDate(term.startsAt)}
          <span className="text-muted-foreground">&nbsp;-&nbsp;</span>
          {formatPragueDate(term.endsAt)}
        </p>
        <div className="space-y-1">
          {term.campCategoryCounts.map((campCategoryCount) => (
            <div
              key={campCategoryCount.campCategory}
              className="flex justify-between rounded-md border p-2"
            >
              <p
                className={`truncate text-sm font-medium ${campCategoryCount.count === 0 ? "text-muted-foreground" : ""}`}
              >
                {campCategoryCount.campName}
              </p>
              <Badge
                variant={campCategoryCount.count > 0 ? "default" : "secondary"}
                className="w-6"
              >
                <span
                  className={`text-xs font-medium ${campCategoryCount.count === 0 ? "text-muted-foreground" : ""}`}
                >
                  {campCategoryCount.count}
                </span>
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
