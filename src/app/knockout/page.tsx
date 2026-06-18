import { SectionPlaceholder } from "@/components/section-placeholder";

type KnockoutPageProps = {
  searchParams: Promise<{ tournamentId?: string }>;
};

export default async function KnockoutPage({ searchParams }: KnockoutPageProps) {
  const { tournamentId } = await searchParams;

  return (
    <SectionPlaceholder
      title="Knockout Bracket"
      description="Follow the elimination rounds to the final"
      tournamentId={tournamentId}
    />
  );
}
