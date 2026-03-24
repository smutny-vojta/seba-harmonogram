import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";

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
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="bg-background text-foreground grid h-svh flex-1 grid-rows-[64px_1fr]">
            <PageHeader />
            <section className="overflow-y-auto p-6">{children}</section>
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
