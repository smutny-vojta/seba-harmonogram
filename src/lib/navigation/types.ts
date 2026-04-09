import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
  title: string;
  href: string;
  icon?: LucideIcon;
  sidebar?: boolean;
  children?: NavigationItem[];
}

export interface NavigationBreadcrumbItem {
  title: string;
  href: string;
}

export interface NavigationTermItem {
  id: string;
  name: string;
}
