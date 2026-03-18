import { scheduleDal } from "@/dal/schedule.dal";

export default async function HarmonogramPage() {
  const entries = await scheduleDal.listScheduleEntries();

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left font-medium">Oddíl</th>
              <th className="p-4 text-left font-medium">Aktivita</th>
              <th className="p-4 text-left font-medium">Datum</th>
              <th className="p-4 text-left font-medium">Od</th>
              <th className="p-4 text-left font-medium">Do</th>
              <th className="p-4 text-left font-medium">Místo</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">
                  Žádné záznamy v harmonogramu
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">{entry.group.name}</td>
                  <td className="p-4">{entry.activityTemplate ? entry.activityTemplate.name : entry.name}</td>
                  <td className="p-4">{new Date(entry.date).toLocaleDateString("cs-CZ")}</td>
                  <td className="p-4">{entry.startTime}</td>
                  <td className="p-4">{entry.endTime}</td>
                  <td className="p-4">{entry.location ?? "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
