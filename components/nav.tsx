import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface NavProps {
  segments?: { label: string; href: string }[];
  className?: string;
}

export const Nav = ({ segments, className }: NavProps) => {
  if (!segments || segments.length === 0) return null;

  const links = segments.slice(0, -1);
  const last = segments[segments.length - 1];

  return (
    <Breadcrumb className={className} aria-label="breadcrumb">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="hover:text-primary transition-colors"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {links.map(({ label, href }) => (
          <React.Fragment key={href}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={href}
                className="hover:text-primary transition-colors"
              >
                {label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage aria-current="page" className="capitalize">
            {last?.label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
