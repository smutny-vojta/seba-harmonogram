import {
  LucideCalendar,
  LucideCalendarRange,
  LucideLayoutDashboard,
  LucideMap,
  LucideStars,
} from "lucide-react";
import type { NavigationItem } from "./types";

export const TERMS_ROUTE = "/dashboard/terms";
export const TERM_DETAIL_ROUTE = "/dashboard/terms/[termId]";

export const NAVIGATION: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
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
    title: "Turnusy",
    href: TERMS_ROUTE,
    icon: LucideCalendarRange,
    children: [
      {
        title: "Detail turnusu",
        href: TERM_DETAIL_ROUTE,
        sidebar: false,
      },
    ],
  },
] as const;
