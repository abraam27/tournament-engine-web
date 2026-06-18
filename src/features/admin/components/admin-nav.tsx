"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/tournaments", label: "Tournaments" },
  { href: "/admin/teams", label: "Teams" },
  { href: "/admin/groups", label: "Groups" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/qualifications", label: "Qualifications" },
  { href: "/admin/brackets", label: "Brackets" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b pb-4">
      {adminNavItems.map(({ href, label, exact }) => {
        const isActive = exact ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
