import PageHeader from "@/components/layout/PageHeader";
import { AppSidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { listTermsForNavigation } from "@/features/terms/dal";
import { formatPragueDate } from "@/lib/date-time/prague";
import { getCurrentFixedTerm } from "@/lib/terms";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: DashboardLayoutProps) {
  // const session = await getServerSession({ disableCookieCache: true });

  // if (!session || !hasRole(session.user.role, "programManager")) {
  //   redirect("/");
  // }

  const terms = await listTermsForNavigation();
  const currentTerm = getCurrentFixedTerm();

  const currentTermNavigation = currentTerm
    ? {
        order: currentTerm.order,
        name: `${currentTerm.order}. turnus`,
        dateRangeLabel: `${formatPragueDate(currentTerm.startsAt)} - ${formatPragueDate(currentTerm.endsAt)}`,
      }
    : null;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar terms={terms} currentTerm={currentTermNavigation} />
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
