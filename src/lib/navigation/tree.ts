import { NAVIGATION, TERMS_ROUTE } from "./config";
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
  const trail = findRouteTrail(normalizePathname(pathname), NAVIGATION);

  if (!trail) {
    return [];
  }

  return trail.map((route) => ({
    title: route.title,
    href: route.href,
  }));
}

export function getTermIdFromPathname(pathname: string): string | null {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);

  if (segments.length !== 3) {
    return null;
  }

  const [dashboardSegment, termsSegment, termIdSegment] = segments;

  if (
    dashboardSegment !== "dashboard" ||
    termsSegment !== "terms" ||
    !termIdSegment
  ) {
    return null;
  }

  return termIdSegment;
}

export function getTermHref(termId: string): string {
  return `${TERMS_ROUTE}/${termId}`;
}

export function getPageTitle(pathname: string): string {
  const breadcrumb = getBreadcrumbs(pathname);

  if (breadcrumb.length === 0) {
    return "Stránka";
  }

  return breadcrumb[breadcrumb.length - 1]?.title ?? "Stránka";
}
