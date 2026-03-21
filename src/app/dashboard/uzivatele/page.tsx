import { userDal } from "@/features/auth/dal";
import { getHighestRoleLabel } from "@/features/auth/auth";

export default async function UzivatelePage() {
  const usersList = await userDal.listUsersWithDetails();

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 text-left font-medium">Jméno</th>
              <th className="p-4 text-left font-medium">E-mail</th>
              <th className="p-4 text-left font-medium">Telefon</th>
              <th className="p-4 text-left font-medium">Role</th>
              <th className="p-4 text-left font-medium">
                Přiřazené oddíly (Instruktor)
              </th>
              <th className="p-4 text-left font-medium">
                Spravované tábory (Vedoucí)
              </th>
            </tr>
          </thead>
          <tbody>
            {usersList.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-muted-foreground p-4 text-center"
                >
                  Žádní uživatelé
                </td>
              </tr>
            ) : (
              usersList.map((usr) => (
                <tr
                  key={usr.id}
                  className="hover:bg-muted/50 border-b last:border-0"
                >
                  <td className="p-4 font-medium">{usr.name}</td>
                  <td className="p-4">{usr.email}</td>
                  <td className="p-4">{usr.phoneNumber ?? "-"}</td>
                  <td className="p-4">{getHighestRoleLabel(usr.role)}</td>
                  <td className="p-4">
                    {usr.instructorAssignments.length > 0
                      ? usr.instructorAssignments
                          .map((a) => a.group.name)
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="p-4">
                    {usr.campCategoryManagers.length > 0
                      ? usr.campCategoryManagers
                          .map(
                            (m) =>
                              `${m.campCategory.name} (${m.term.id}. turnus)`,
                          )
                          .join(", ")
                      : "-"}
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
