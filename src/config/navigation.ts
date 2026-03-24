import { Calendar, LayoutDashboard, Map, Send, Stars } from "lucide-react";

export const NAVIGATION = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    subPages: [],
  },
  {
    title: "Harmonogram",
    href: "/dashboard/harmonogram",
    icon: Calendar,
    subPages: [
      {
        title: "Aktivity",
        href: "/dashboard/harmonogram/aktivity",
        icon: Stars,
      },
      {
        title: "Lokace",
        href: "/dashboard/harmonogram/lokace",
        icon: Map,
      },
    ],
  },
] as const;
