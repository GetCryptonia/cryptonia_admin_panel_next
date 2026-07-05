import DashboardContent from "@/components/dashboard/dashboard_content";
import { getDefaultDateRange } from "@/lib/features/dashboard/date_range";
import * as service from "@/lib/features/dashboard/service";

export default async function DashboardPage() {
  const range = getDefaultDateRange();
  const data = await service.getDashboardData(range);

  return <DashboardContent initialData={data} />;
}
