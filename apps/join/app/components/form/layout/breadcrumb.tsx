import Link from "next/link";
import React from "react";
import { Home } from "lucide-react";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items?: Crumb[] }) {
  const defaultItems: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Join", href: "/join" },
    { label: "Form" },
  ];

  const crumbs = items && items.length ? items : defaultItems;

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mt-0 mb-4">
      <ol className="flex items-center gap-0.5">
        <li className="flex items-center">
          <Link
            href={crumbs[0].href || "/"}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <span className="sr-only">Home</span>
            <Home className="w-4 h-4" aria-hidden />
          </Link>
        </li>

        <li className="flex items-center">
          <span className="text-gray-600">{crumbs[0].label}</span>
        </li>

        {crumbs.slice(1).map((c, idx) => {
          const isLast = idx === crumbs.slice(1).length - 1;
          return (
            <li key={idx} className="flex items-center">
              <span className="mx-2 text-gray-300 select-none">/</span>
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold">{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
