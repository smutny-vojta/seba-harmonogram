import { activityDal } from "@/features/activities/dal";

import { CreateActivityDialog } from "@/features/activities/components/CreateActivityDialog";
import { UpdateActivityDialog } from "@/features/activities/components/UpdateActivityDialog";
import { DeleteActivityDialog } from "@/features/activities/components/DeleteActivityDialog";

const activityTypeMap = {
  game: "Hra",
  sport: "Sport",
  organizational: "Organizační",
  other: "Ostatní",
};

export default async function AktivityPage() {
  const activities = await activityDal.listActivityTemplates();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <CreateActivityDialog />
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 text-left font-medium">Název</th>
              <th className="p-4 text-left font-medium">Typ</th>
              <th className="p-4 text-left font-medium">Délka (min)</th>
              <th className="p-4 text-left font-medium">Místo</th>
              <th className="p-4 text-left font-medium">Materiály</th>
              <th className="p-4 text-right font-medium">Akce</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-muted-foreground p-4 text-center"
                >
                  Žádné aktivity
                </td>
              </tr>
            ) : (
              activities.map((act) => (
                <tr
                  key={act.id}
                  className="hover:bg-muted/50 border-b last:border-0"
                >
                  <td className="p-4 font-medium">{act.name}</td>
                  <td className="p-4">
                    {activityTypeMap[act.type as keyof typeof activityTypeMap]}
                  </td>
                  <td className="p-4">{act.durationMinutes ?? "-"}</td>
                  <td className="p-4">{act.location ?? "-"}</td>
                  <td className="p-4">{act.materials ?? "-"}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <UpdateActivityDialog activity={act} />
                      <DeleteActivityDialog activity={act} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
