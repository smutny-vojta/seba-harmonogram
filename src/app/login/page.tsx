import LoginComponent from "@/app/login/_components/LoginComponent";
import { getServerSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <LoginComponent />
    </div>
  );
}
