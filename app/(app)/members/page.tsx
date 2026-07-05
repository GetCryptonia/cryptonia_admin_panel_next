import MembersContent from "@/components/members/members_content";
import * as service from "@/lib/features/members/service";

export default async function MembersPage() {
  const data = await service.getMembers();

  return <MembersContent initialData={data} />;
}
