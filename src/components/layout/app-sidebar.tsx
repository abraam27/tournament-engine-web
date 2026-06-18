"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Trophy,
  Users,
  Grid3X3,
  Swords,
  BarChart3,
  Medal,
  GitBranch,
  Shield,
  ListOrdered,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getTournaments } from "@/features/tournaments/api/tournaments.api";
import { useMounted } from "@/lib/hooks/use-mounted";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p === "/" },
  {
    href: "dynamic-tournament",
    label: "Tournaments",
    icon: Trophy,
    match: (p: string) => p.startsWith("/tournaments"),
  },
  { href: "/teams", label: "Teams", icon: Users, match: (p: string) => p.startsWith("/teams") },
  { href: "/groups", label: "Groups", icon: Grid3X3, match: (p: string) => p.startsWith("/groups") },
  { href: "/matches", label: "Matches", icon: Swords, match: (p: string) => p.startsWith("/matches") },
  { href: "/standings", label: "Standings", icon: BarChart3, match: (p: string) => p.startsWith("/standings") },
  {
    href: "/qualifications",
    label: "Qualifications",
    icon: Medal,
    match: (p: string) =>
      p === "/qualifications" ||
      (p.includes("/qualifications") && !p.includes("third-place")),
  },
  {
    href: "/qualifications/third-place",
    label: "Third Place Ranking",
    icon: ListOrdered,
    match: (p: string) => p.startsWith("/qualifications/third-place"),
  },
  { href: "/knockout", label: "Knockout Bracket", icon: GitBranch, match: (p: string) => p.startsWith("/knockout") },
  { href: "/admin", label: "Admin", icon: Shield, match: (p: string) => p.startsWith("/admin") },
];

type AppSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export function AppSidebar({ open = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const mounted = useMounted();

  const { data: tournaments = [] } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
    enabled: mounted,
  });

  const featuredTournament =
    tournaments.length > 0
      ? [...tournaments].sort((a, b) => b.year - a.year)[0]
      : null;

  const tournamentHref = featuredTournament
    ? `/tournaments/${featuredTournament._id}`
    : "/";

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4 lg:hidden">
          <span className="text-sm font-medium">Navigation</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ href, label, icon: Icon, match }) => {
            const resolvedHref =
              href === "dynamic-tournament" ? tournamentHref : href;
            const isActive = match(pathname);

            return (
              <Link
                key={label}
                href={resolvedHref}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
