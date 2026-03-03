import { getServerSession, hasMinRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (hasMinRole(session.user.role, "programak")) {
    redirect("/dashboard");
  }

  return <div>Logged in as {session.user.email}</div>;
}
