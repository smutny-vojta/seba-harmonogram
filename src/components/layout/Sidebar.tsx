"use client";

import { LucideChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  GROUPS_ROUTE,
  getTermHref,
  isRouteActive,
  isRouteMatch,
  NAVIGATION,
  type NavigationItem,
  type NavigationTermItem,
} from "@/lib/navigation";
import { cn } from "@/utils/cn";

interface AppSidebarProps {
  terms: NavigationTermItem[];
  currentTerm: {
    order: number;
    name: string;
    dateRangeLabel: string;
  } | null;
}

export function AppSidebar({ terms, currentTerm }: AppSidebarProps) {
  const pathname = usePathname();
  const [termsOpen, setTermsOpen] = useState(pathname.startsWith(GROUPS_ROUTE));
  const sidebarNavigation = NAVIGATION.filter((page) => page.sidebar !== false);
  const termNavigationItems = useMemo(
    () =>
      terms.map((term) => ({ title: term.name, href: getTermHref(term.id) })),
    [terms],
  );

  useEffect(() => {
    if (pathname.startsWith(GROUPS_ROUTE)) {
      setTermsOpen(true);
    }
  }, [pathname]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-20 flex-row items-center justify-between border-b">
        <h1 className="text-3xl font-bold">SiS</h1>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {sidebarNavigation.map((page: NavigationItem) =>
                page.href === GROUPS_ROUTE ? (
                  <Collapsible
                    key={page.href}
                    open={termsOpen}
                    onOpenChange={setTermsOpen}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isRouteActive(pathname, page)}
                      >
                        <Link href={page.href}>
                          {page.icon ? <page.icon /> : null}
                          <span className="text-[15px]">{page.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction
                          className="data-[state=open]:rotate-90"
                          showOnHover
                        >
                          <LucideChevronRight className="size-4" />
                          <span className="sr-only">Přepnout oddíly</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="">
                          {termNavigationItems.map((termPage) => (
                            <SidebarMenuSubItem key={termPage.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isRouteMatch(pathname, termPage.href)}
                              >
                                <Link href={termPage.href}>
                                  <span>{termPage.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                          {termNavigationItems.length === 0 ? (
                            <SidebarMenuSubItem>
                              <span
                                className={cn(
                                  "text-muted-foreground block px-2 py-1 text-sm",
                                )}
                              >
                                Žádné turnusy
                              </span>
                            </SidebarMenuSubItem>
                          ) : null}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={page.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isRouteActive(pathname, page)}
                    >
                      <Link href={page.href}>
                        {page.icon ? <page.icon /> : null}
                        <span className="text-[15px]">{page.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {page.children && page.children.length > 0 && (
                      <SidebarMenuSub className="">
                        {page.children
                          .filter((subPage) => subPage.sidebar !== false)
                          .map((subPage) => (
                            <SidebarMenuSubItem key={subPage.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isRouteMatch(pathname, subPage.href)}
                              >
                                <Link href={subPage.href}>
                                  {subPage.icon ? <subPage.icon /> : null}
                                  <span>{subPage.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooterContent currentTerm={currentTerm} />
    </Sidebar>
  );
}

interface SidebarFooterContentProps {
  currentTerm: {
    order: number;
    name: string;
    dateRangeLabel: string;
  } | null;
}

const SidebarFooterContent = ({ currentTerm }: SidebarFooterContentProps) => {
  const { open } = useSidebar();

  return (
    <SidebarFooter className="h-16">
      <div className="my-auto flex items-center gap-2">
        <div
          className="bg-primary text-primary-foreground grid shrink-0 place-items-center rounded font-bold transition-all duration-200 select-none"
          style={{
            width: open ? "48px" : "32px",
            height: open ? "48px" : "32px",
            padding: open ? "0.5rem" : "0",
            fontSize: open ? "32px" : "24px",
            lineHeight: open ? "24px" : "18px",
          }}
        >
          {currentTerm ? currentTerm.order : "-"}
        </div>
        {open && (
          <div className="flex flex-col">
            <span
              className="font-bold whitespace-nowrap"
              style={{
                fontSize: "18px",
                lineHeight: "22px",
              }}
            >
              {currentTerm ? currentTerm.name : "Mimo turnus"}
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: "14px",
                lineHeight: "16px",
              }}
            >
              {currentTerm
                ? currentTerm.dateRangeLabel
                : "Není aktivní žádný turnus"}
            </span>
          </div>
        )}
      </div>
    </SidebarFooter>
  );
};
