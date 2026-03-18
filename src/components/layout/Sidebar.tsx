import Link from "next/link";
import {
  CalendarDays,
  ChefHat,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Tent,
  Users,
  FileText,
  CircleUser,
  ChevronUp,
} from "lucide-react";
import {
  Sidebar as SidebarContainer,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { getActiveTerm } from "@/dal/term.dal";
import {
  getHighestRoleLabel,
  getServerSession,
  hasRole,
} from "@/lib/auth-utils";
import LogoutButton from "../auth/LogoutButton";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

export default async function Sidebar() {
  const activeTerm = await getActiveTerm();
  const session = await getServerSession({ disableCookieCache: true });

  return (
    <SidebarContainer side="left" collapsible="icon">
      {/* Header — Aktivní turnus */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="bg-sidebar text-sidebar-foreground hover:bg-sidebar/90 hover:text-sidebar-foreground flex items-center gap-2 p-2">
              <div className="bg-sidebar-foreground/20 flex aspect-square size-8 items-center justify-center rounded-lg text-sm font-bold">
                {activeTerm ? activeTerm.id : "-"}
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">
                  {activeTerm
                    ? `${activeTerm.id}. Turnus`
                    : "Žádný aktivní turnus"}
                </span>
                {activeTerm && (
                  <span className="text-xs opacity-80">
                    {formatDate(activeTerm.startDate)} -{" "}
                    {formatDate(activeTerm.endDate)}
                  </span>
                )}
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {!activeTerm && (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <p className="text-muted-foreground px-2 text-sm">
                Momentálně neběží žádný turnus.
              </p>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      )}

      <SidebarContent>
        {hasRole(session?.user.role, "programManager") && (
          <>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard">
                      <Link href="/program">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Zprávy">
                      <Link href="/program/zpravy">
                        <MessageSquare />
                        <span>Zprávy</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Program */}
        {hasRole(session?.user.role, "programManager") && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Správa programu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Šablony">
                      <Link href="/program/aktivity">
                        <FileText />
                        <span>Aktivity</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Plán">
                      <Link href="/program/harmonogram">
                        <CalendarDays />
                        <span>Harmonogram</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Tábor */}
        {hasRole(session?.user.role, "headProgramManager") && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Správa tábora</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Kategorie">
                      <Link href="/program/tabory">
                        <Tent />
                        <span>Tábory</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Oddíly">
                      <Link href="/program/oddily">
                        <MapPin />
                        <span>Oddíly</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Jídelníček">
                      <Link href="/program/jidelnicek">
                        <ChefHat />
                        <span>Jídelníček</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Správa */}
        {hasRole(session?.user.role, "headManager") && (
          <SidebarGroup>
            <SidebarGroupLabel>Správa uživatelů</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Uživatelé">
                    <Link href="/program/uzivatele">
                      <Users />
                      <span>Uživatelé</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer — Uživatelský profil */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="flex aspect-square size-8 shrink-0 items-center justify-center">
                    <CircleUser className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-medium">
                      {session?.user?.name ?? "Nepřihlášen"}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {getHighestRoleLabel(session?.user?.role)}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="bg-sidebar text-sidebar-foreground ring-sidebar-border w-[--radix-popper-anchor-width]"
                side="top"
                align="end"
              >
                <DropdownMenuItem className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground">
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarContainer>
  );
}
