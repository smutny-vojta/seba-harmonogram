"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getBreadcrumbs,
  getPageTitle,
  getTermIdFromPathname,
  isRouteMatch,
  TERM_DETAIL_ROUTE,
  type NavigationTermItem,
} from "@/lib/navigation";

interface PageHeaderProps {
  terms: NavigationTermItem[];
}

export default function PageHeader({ terms }: PageHeaderProps) {
  const pathname = usePathname();
  const termId = getTermIdFromPathname(pathname);
  const activeTerm = termId
    ? terms.find((term) => term.id === termId)
    : undefined;
  const isTermDetailPage = isRouteMatch(pathname, TERM_DETAIL_ROUTE);
  const breadcrumbs = getBreadcrumbs(pathname).map((breadcrumb, index, all) => {
    const isLastItem = index === all.length - 1;

    if (!isLastItem || !isTermDetailPage || !activeTerm) {
      return breadcrumb;
    }

    return {
      ...breadcrumb,
      title: activeTerm.name,
    };
  });
  const title = activeTerm?.name ?? getPageTitle(pathname);

  return (
    <header className="flex h-20 flex-col items-start justify-center border-b px-6">
      <div className="flex min-w-0 flex-col gap-1">
        {breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((breadcrumb, index) => {
                const isLastItem = index === breadcrumbs.length - 1;

                return (
                  <Fragment key={`${breadcrumb.href}-${breadcrumb.title}`}>
                    {index > 0 ? <BreadcrumbSeparator /> : null}
                    <BreadcrumbItem>
                      {isLastItem ? (
                        <BreadcrumbPage className="text-xl font-bold">
                          {title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={breadcrumb.href}>{breadcrumb.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        ) : null}
      </div>
    </header>
  );
}
