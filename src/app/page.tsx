import { getSessionUncached, hasRole } from "@/features/auth/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  // const session = await getSessionUncached();

  // if (!session || !session.user.emailVerified) {
  //   return <LoginComponent />;
  // }

  // if (hasRole(session.user.role, "programManager")) {
  //   redirect("/dashboard");
  // }

  return (
    <div>
      {/* Logged in as {session.user.email} */}
      <div>
        <a href="/dashboard">Dashboard</a>
      </div>
      <div>
        <a href="/dashboard/harmonogram">Harmonogram</a>
      </div>
      <div>
        <a href="/dashboard/harmonogram/aktivity">Aktivity</a>
      </div>
      <div>
        <a href="/dashboard/harmonogram/lokace">Lokace</a>
      </div>
    </div>
  );
}
