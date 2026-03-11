import LoginComponent from "@/components/auth/LoginContainer";
import LogoutButton from "@/components/auth/LogoutButton";
import { getServerSession, hasRole } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession({ disableCookieCache: true });

  if (!session || !session.user.emailVerified) {
    return <LoginComponent />;
  }

  if (hasRole(session.user.role, "programManager")) {
    redirect("/program");
  }

  return (
    <div>
      Logged in as {session.user.email}
      <LogoutButton />
    </div>
  );
}
