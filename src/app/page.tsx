import LoginComponent from "@/features/auth/components/LoginContainer";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { getSessionUncached, hasRole } from "@/features/auth/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSessionUncached();

  if (!session || !session.user.emailVerified) {
    return <LoginComponent />;
  }

  if (hasRole(session.user.role, "programManager")) {
    redirect("/dashboard");
  }

  return (
    <div>
      Logged in as {session.user.email}
      <LogoutButton />
    </div>
  );
}
