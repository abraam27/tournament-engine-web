import { GroupDetailsContent } from "@/features/groups/components/group-details-content";

type GroupDetailsPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupDetailsPage({
  params,
}: GroupDetailsPageProps) {
  const { groupId } = await params;

  return <GroupDetailsContent groupId={groupId} />;
}
