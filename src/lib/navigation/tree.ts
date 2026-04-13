import { DASHBOARD_ROUTE, GROUPS_ROUTE, NAVIGATION } from "./config";
import type { NavigationBreadcrumbItem, NavigationItem } from "./types";

const PATH_PARAM_REGEXP = /^\[[^/]+\]$/;
const CATCH_ALL_PARAM_REGEXP = /^\[\.\.\.[^/]+\]$/;

const normalizePathname = (pathname: string) => {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
};

const escapeRegExp = (value: string) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const routeToRegExp = (href: string) => {
  const pattern = normalizePathname(href)
    .split("/")
    .map((segment) => {
      if (CATCH_ALL_PARAM_REGEXP.test(segment)) {
        return ".+";
      }

      if (PATH_PARAM_REGEXP.test(segment)) {
        return "[^/]+";
      }

      return escapeRegExp(segment);
    })
    .join("/");

  return new RegExp(`^${pattern}$`);
};

const isDashboardPath = (pathname: string) => {
  return (
    pathname === DASHBOARD_ROUTE || pathname.startsWith(`${DASHBOARD_ROUTE}/`)
  );
};

const formatSegmentLabel = (segment: string) => {
  if (!segment) {
    return "Stránka";
  }

  const decodedSegment = decodeURIComponent(segment);

  return decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1);
};

const getDashboardFallbackBreadcrumbs = (
  pathname: string,
): NavigationBreadcrumbItem[] => {
  const normalizedPathname = normalizePathname(pathname);

  if (!isDashboardPath(normalizedPathname)) {
    return [];
  }

  const dashboardBreadcrumb: NavigationBreadcrumbItem = {
    title: "Dashboard",
    href: DASHBOARD_ROUTE,
  };

  const segments = normalizedPathname.split("/").filter(Boolean).slice(1);

  if (segments.length === 0) {
    return [dashboardBreadcrumb];
  }

  const nestedBreadcrumbs = segments.map((segment, index) => ({
    title: formatSegmentLabel(segment),
    href: `${DASHBOARD_ROUTE}/${segments.slice(0, index + 1).join("/")}`,
  }));

  return [dashboardBreadcrumb, ...nestedBreadcrumbs];
};

const findRouteTrail = (
  pathname: string,
  routes: readonly NavigationItem[],
  parentTrail: readonly NavigationItem[] = [],
): NavigationItem[] | null => {
  for (const route of routes) {
    const nextTrail = [...parentTrail, route];

    if (isRouteMatch(pathname, route.href)) {
      return nextTrail;
    }

    if (!route.children) {
      continue;
    }

    const childTrail = findRouteTrail(pathname, route.children, nextTrail);

    if (childTrail) {
      return childTrail;
    }
  }

  return null;
};

export function isRouteMatch(pathname: string, href: string): boolean {
  const normalizedPathname = normalizePathname(pathname);
  const matcher = routeToRegExp(href);

  return matcher.test(normalizedPathname);
}

export function isRouteActive(
  pathname: string,
  route: NavigationItem,
): boolean {
  if (isRouteMatch(pathname, route.href)) {
    return true;
  }

  return (
    route.children?.some((childRoute) => isRouteActive(pathname, childRoute)) ??
    false
  );
}

export function getBreadcrumbs(pathname: string): NavigationBreadcrumbItem[] {
  const normalizedPathname = normalizePathname(pathname);
  const trail = findRouteTrail(normalizedPathname, NAVIGATION);

  if (!trail) {
    return getDashboardFallbackBreadcrumbs(normalizedPathname);
  }

  const breadcrumbs = trail.map((route) => ({
    title: route.title,
    href: route.href,
  }));

  if (!isDashboardPath(normalizedPathname)) {
    return breadcrumbs;
  }

  const hasDashboardRoot = breadcrumbs.some(
    (breadcrumb) => breadcrumb.href === DASHBOARD_ROUTE,
  );

  if (hasDashboardRoot) {
    return breadcrumbs;
  }

  return [
    {
      title: "Dashboard",
      href: DASHBOARD_ROUTE,
    },
    ...breadcrumbs,
  ];
}

export function getTermIdFromPathname(pathname: string): string | null {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);

  if (segments.length !== 3) {
    return null;
  }

  const [dashboardSegment, sectionSegment, termIdSegment] = segments;

  if (
    dashboardSegment !== "dashboard" ||
    (sectionSegment !== "groups" && sectionSegment !== "terms") ||
    !termIdSegment
  ) {
    return null;
  }

  return termIdSegment;
}

export function getTermHref(termId: string): string {
  return `${GROUPS_ROUTE}/${termId}`;
}

export function getPageTitle(pathname: string): string {
  const breadcrumb = getBreadcrumbs(pathname);

  if (breadcrumb.length === 0) {
    return "Stránka";
  }

  return breadcrumb[breadcrumb.length - 1]?.title ?? "Stránka";
}
