import PageHeader from "@/components/layout/PageHeader";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { listTermsForNavigation } from "@/features/terms/dal";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: DashboardLayoutProps) {
  // const session = await getServerSession({ disableCookieCache: true });

  // if (!session || !hasRole(session.user.role, "programManager")) {
  //   redirect("/");
  // }

  const terms = await listTermsForNavigation();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar terms={terms} />
          <main className="bg-background text-foreground grid h-svh flex-1 grid-rows-[80px_1fr]">
            <PageHeader terms={terms} />
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
