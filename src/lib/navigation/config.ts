import {
  LucideCalendar,
  LucideCalendarRange,
  LucideLayoutDashboard,
  LucideMap,
  LucideStars,
  LucideUsers,
} from "lucide-react";
import type { NavigationItem } from "./types";

export const DASHBOARD_ROUTE = "/dashboard";
export const GROUPS_ROUTE = "/dashboard/groups";
export const GROUP_DETAIL_ROUTE = "/dashboard/groups/[termId]";
export const TERMS_ROUTE = "/dashboard/terms";
export const TERMS_DETAIL_ROUTE = "/dashboard/terms/[termId]";
export const TERM_DETAIL_ROUTE = GROUP_DETAIL_ROUTE;

export const NAVIGATION: NavigationItem[] = [
  {
    title: "Dashboard",
    href: DASHBOARD_ROUTE,
    icon: LucideLayoutDashboard,
    children: [],
  },
  {
    title: "Harmonogram",
    href: "/dashboard/schedule",
    icon: LucideCalendar,
    children: [
      {
        title: "Aktivity",
        href: "/dashboard/schedule/activities",
        icon: LucideStars,
      },
      {
        title: "Lokace",
        href: "/dashboard/schedule/locations",
        icon: LucideMap,
      },
    ],
  },
  {
    title: "Oddíly",
    href: GROUPS_ROUTE,
    icon: LucideUsers,
    children: [
      {
        title: "Detail turnusu",
        href: GROUP_DETAIL_ROUTE,
        sidebar: false,
      },
    ],
  },
  {
    title: "Turnusy",
    href: TERMS_ROUTE,
    icon: LucideCalendarRange,
    children: [
      {
        title: "Detail turnusu",
        href: TERMS_DETAIL_ROUTE,
        sidebar: false,
      },
    ],
  },
] as const;
