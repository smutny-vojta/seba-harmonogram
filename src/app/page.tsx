import { getServerSession, hasRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // if (hasRole(session.user.role!, "programManager")) {
  //   redirect("/dashboard");
  // }

  return <div>Logged in as {session.user.email}</div>;
}
