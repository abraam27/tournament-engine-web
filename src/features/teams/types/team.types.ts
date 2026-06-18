export type Confederation =
  | "CAF"
  | "UEFA"
  | "AFC"
  | "CONMEBOL"
  | "CONCACAF"
  | "OFC";

export type Team = {
  _id: string;
  name: string;
  code: string;
  flagUrl?: string;
  confederation?: Confederation;
  fifaRanking?: number;
  createdAt?: string;
  updatedAt?: string;
};
