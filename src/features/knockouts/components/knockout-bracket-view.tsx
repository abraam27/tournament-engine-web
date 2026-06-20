import type { KnockoutBracketRounds } from "../types/bracket.types";
import { KnockoutBracket, KnockoutBracketMobile } from "./knockout-bracket";

type KnockoutBracketViewProps = {
  rounds: KnockoutBracketRounds;
};

export function KnockoutBracketView({ rounds }: KnockoutBracketViewProps) {
  return (
    <>
      <KnockoutBracket rounds={rounds} />
      <KnockoutBracketMobile rounds={rounds} />
    </>
  );
}
