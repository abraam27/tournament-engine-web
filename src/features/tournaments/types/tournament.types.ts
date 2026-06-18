export type TournamentStatus = "draft" | "group_stage" | "knockout" | "finished";

export type Tournament = {
  _id: string;
  name: string;
  year: number;
  status: TournamentStatus;
  teamsCount: number;
  groupsCount: number;
  teamsPerGroup: number;
  qualifiedPerGroup: number;
  bestThirdCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export const TOURNAMENT_STATUS_LABELS: Record<TournamentStatus, string> = {
  draft: "Draft",
  group_stage: "Group Stage",
  knockout: "Knockout",
  finished: "Finished",
};
