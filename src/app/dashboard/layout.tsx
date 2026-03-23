import Sidebar from "@/shared/components/layout/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

import PageHeader from "@/shared/components/layout/PageHeader";
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
    //   <TooltipProvider>
    //     <SidebarProvider>
    //       <Sidebar />
    //       <SidebarTrigger className="fixed bottom-4 left-[calc(var(--sidebar-width)+0.5rem)] z-20 transition-all duration-200 ease-linear peer-data-[state=collapsed]:left-[calc(var(--sidebar-width-icon)+0.5rem)]" />
    //       <main className="relative flex min-h-svh flex-1 flex-col">
    //         <PageHeader />
    <section className="flex-1 p-4">{children}</section>
    //     </main>
    //   </SidebarProvider>
    // </TooltipProvider>
  );
}
