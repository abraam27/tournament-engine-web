"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TeamDetailsModal } from "./team-details-modal";
import type { Team } from "../types/team.types";

type TeamsTableProps = {
  teams: Team[];
};

export function TeamsTable({ teams }: TeamsTableProps) {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (team: Team) => {
    setSelectedTeam(team);
    setModalOpen(true);
  };

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Confederation</TableHead>
              <TableHead>FIFA Ranking</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {team.flagUrl && (
                      <img
                        src={team.flagUrl}
                        alt=""
                        className="size-5 rounded object-cover"
                      />
                    )}
                    {team.name}
                  </div>
                </TableCell>
                <TableCell>{team.code}</TableCell>
                <TableCell>{team.confederation ?? "—"}</TableCell>
                <TableCell>{team.fifaRanking ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      render={<Link href={`/teams/${team._id}`} />}
                      nativeButton={false}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal(team)}
                    >
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TeamDetailsModal
        team={selectedTeam}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
