import Link from "next/link";
import {
  BarChart3,
  GitBranch,
  Grid3X3,
  Swords,
  Trophy,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TournamentStatsCardsProps = {
  tournamentsCount: number;
  teamsCount: number;
  groupsCount: number;
  matchesCount?: number;
};

const stats = [
  {
    key: "tournamentsCount" as const,
    label: "Tournaments",
    icon: Trophy,
  },
  {
    key: "teamsCount" as const,
    label: "Teams",
    icon: Users,
  },
  {
    key: "groupsCount" as const,
    label: "Groups",
    icon: Grid3X3,
  },
  {
    key: "matchesCount" as const,
    label: "Matches",
    icon: Swords,
  },
];

export function TournamentStatsCards({
  tournamentsCount,
  teamsCount,
  groupsCount,
  matchesCount,
}: TournamentStatsCardsProps) {
  const values = {
    tournamentsCount,
    teamsCount,
    groupsCount,
    matchesCount: matchesCount ?? "—",
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{values[key]}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type QuickLinksProps = {
  tournamentId: string;
};

export function TournamentQuickLinks({ tournamentId }: QuickLinksProps) {
  const links = [
    { label: "View Tournament", href: `/tournaments/${tournamentId}` },
    { label: "Teams", href: "/teams" },
    { label: "Groups", href: `/groups?tournamentId=${tournamentId}` },
    { label: "Matches", href: `/matches?tournamentId=${tournamentId}` },
    {
      label: "Standings",
      href: `/standings?tournamentId=${tournamentId}`,
    },
    {
      label: "Knockout Bracket",
      href: `/knockout?tournamentId=${tournamentId}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              {link.label === "Standings" && (
                <BarChart3 className="size-3.5" />
              )}
              {link.label === "Knockout Bracket" && (
                <GitBranch className="size-3.5" />
              )}
              {link.label}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
