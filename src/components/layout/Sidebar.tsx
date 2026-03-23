"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NAVIGATION } from "@/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeaderContent />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Program</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION.map((page) => (
                <SidebarMenuItem key={page.href}>
                  <SidebarMenuButton asChild isActive={pathname === page.href}>
                    <Link href={page.href}>
                      <page.icon />
                      <span className="text-[15px]">{page.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuSub className="">
                    {page.subPages.map((subPage) => (
                      <SidebarMenuSubItem key={subPage.href}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subPage.href}
                        >
                          <Link href={subPage.href}>
                            <subPage.icon />
                            <span>{subPage.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex-row justify-end">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}

const SidebarHeaderContent = () => {
  const { open } = useSidebar();

  return (
    <SidebarHeader className="h-16">
      <div className="my-auto flex items-center gap-2">
        <div
          className="bg-primary text-secondary grid shrink-0 place-items-center rounded font-bold transition-all duration-200 select-none"
          style={{
            width: open ? "48px" : "32px",
            height: open ? "48px" : "32px",
            padding: open ? "0.5rem" : "0",
            fontSize: open ? "24px" : "18px",
            lineHeight: open ? "24px" : "18px",
          }}
        >
          2
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
              2. turnus
            </span>
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: "14px",
                lineHeight: "16px",
              }}
            >
              10.7. - 19.7.
            </span>
          </div>
        )}
      </div>
    </SidebarHeader>
  );
};
