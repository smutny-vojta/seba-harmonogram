import {
  LucideCalendar,
  LucideCalendarRange,
  LucideLayoutDashboard,
  LucideMap,
  LucideStars,
  LucideUsers,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon: React.ComponentType;
  subPages: Omit<NavigationItem, "subPages">[];
  separator?: boolean;
};

export const NAVIGATION: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LucideLayoutDashboard,
    subPages: [],
  },
  {
    title: "Harmonogram",
    href: "/dashboard/harmonogram",
    icon: LucideCalendar,
    subPages: [
      {
        title: "Aktivity",
        href: "/dashboard/harmonogram/aktivity",
        icon: LucideStars,
      },
      {
        title: "Lokace",
        href: "/dashboard/harmonogram/lokace",
        icon: LucideMap,
      },
    ],
  },
  {
    title: "Turnusy",
    href: "/dashboard/terms",
    icon: LucideCalendarRange,
    subPages: [],
  },
  {
    title: "Oddíly",
    href: "/dashboard/groups",
    icon: LucideUsers,
    subPages: [],
  },
] as const;
