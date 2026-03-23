import { groupDal } from "@/features/camp/dal";

export default async function OddilyPage() {
  const groups = await groupDal.listGroups();

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left font-medium">Název oddílu</th>
              <th className="p-4 text-left font-medium">Tábor</th>
              <th className="p-4 text-left font-medium">Turnus</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-muted-foreground"
                >
                  Žádné oddíly
                </td>
              </tr>
            ) : (
              groups.map((g) => (
                <tr
                  key={g.id}
                  className="border-b last:border-0 hover:bg-muted/50"
                >
                  <td className="p-4 font-medium">{g.name}</td>
                  <td className="p-4">{g.campCategory.name}</td>
                  <td className="p-4">{g.term.id}. turnus</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
