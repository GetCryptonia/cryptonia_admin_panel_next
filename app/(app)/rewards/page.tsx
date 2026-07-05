import RewardsContent from "@/components/rewards/rewards_content";
import * as service from "@/lib/features/rewards/service";

export default async function RewardsPage() {
  const data = await service.getRewards();

  return <RewardsContent initialData={data} />;
}
