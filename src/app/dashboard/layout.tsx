import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/Sidebar";

import PageHeader from "@/components/layout/PageTitle";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await getServerSession({ disableCookieCache: true });

  // if (!session || !hasRole(session.user.role, "programManager")) {
  //   redirect("/");
  // }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="grid h-svh flex-1 grid-rows-[64px_1fr]">
          <PageHeader />
          <section className="overflow-y-auto p-4">{children}</section>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
