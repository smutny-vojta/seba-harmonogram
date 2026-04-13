import { getCurrentFixedTerm } from "@/lib/terms";

export default async function HarmonogramPage() {
  const currentTerm = getCurrentFixedTerm();

  if (!currentTerm) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Harmonogram</h1>
        <p className="text-muted-foreground text-sm">
          Aktuálně neprobíhá žádný turnus. Harmonogram se zobrazuje podle
          aktuálního turnusu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold">Harmonogram</h1>
      <p className="text-muted-foreground text-sm">
        Zobrazen je harmonogram aktuálního turnusu:{" "}
        <b>{currentTerm.order}. turnus</b>
      </p>
      <p className="text-muted-foreground text-sm">
        Kancl je veden jako samostatný oddíl v rámci harmonogramu.
      </p>
    </div>
  );
}
