import LoginComponent from "@/app/login/_components/LoginComponent";
import { getServerSession } from "@/lib/auth-utils";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";

export default async function Login() {
  const session = await getServerSession();

  if (session && session.user.emailVerified) {
    redirect("/");
  }

  return (
    <>
      <Toaster
        expand
        richColors
        position="top-center"
        duration={4000}
        className="z-99"
      />
      <div className="flex h-screen items-center justify-center">
        <LoginComponent />
      </div>
    </>
  );
}
