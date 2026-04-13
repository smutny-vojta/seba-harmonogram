import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPragueDate } from "@/lib/date-time/prague";
import { getCurrentFixedTerm } from "@/lib/terms";

const CURRENT_TERM_SECTIONS = [
  {
    title: "Harmonogram",
    description: "Denní program podle aktuálního turnusu.",
    href: "/dashboard/schedule",
  },
  {
    title: "Oddíly",
    description: "Správa oddílů a přiřazení lidí v aktuálním turnusu.",
    href: "/dashboard/groups",
  },
] as const;

const SHARED_SECTIONS = [
  {
    title: "Aktivity",
    description: "Šablony aktivit sdílené napříč všemi turnusy.",
    href: "/dashboard/schedule/activities",
  },
  {
    title: "Lokace",
    description: "Místa aktivit sdílená napříč všemi turnusy.",
    href: "/dashboard/schedule/locations",
  },
  {
    title: "Turnusy",
    description: "Informační přehled fixních turnusů s odkazy na oddíly.",
    href: "/dashboard/terms",
  },
] as const;

export default function Page() {
  const currentTerm = getCurrentFixedTerm();
  const currentTermLabel = currentTerm
    ? `${currentTerm.order}. turnus (${formatPragueDate(currentTerm.startsAt)} - ${formatPragueDate(currentTerm.endsAt)})`
    : "Momentálně není aktivní žádný turnus";

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">Admin rozcestník</h1>
        <p className="text-muted-foreground text-sm">
          Aktuální turnus:{" "}
          <span className="text-foreground font-medium">
            {currentTermLabel}
          </span>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Podle aktuálního turnusu</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {CURRENT_TERM_SECTIONS.map((item) => (
            <Card key={item.href} className="border-border/80">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={item.href}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Otevřít
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Napříč všemi turnusy</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SHARED_SECTIONS.map((item) => (
            <Card key={item.href} className="border-border/80">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href={item.href}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Otevřít
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
