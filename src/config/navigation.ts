import {
  LucideCalendar,
  LucideLayoutDashboard,
  LucideMap,
  LucideStars,
} from "lucide-react";

export const NAVIGATION = [
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
] as const;
