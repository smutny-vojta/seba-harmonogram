import PageHeader from "@/components/layout/PageTitle";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: DashboardLayoutProps) {
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
            <Toaster
              richColors
              duration={2000}
              position="bottom-right"
              theme="system"
            />
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
