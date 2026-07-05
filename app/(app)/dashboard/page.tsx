import DashboardContent from "@/components/dashboard/dashboard_content";
import { fetchDashboardDataAction } from "@/lib/features/dashboard/actions";
import { getDefaultDateRange } from "@/lib/features/dashboard/date_range";

export default async function DashboardPage() {
  const range = getDefaultDateRange();
  const result = await fetchDashboardDataAction(range);

  return (
    <DashboardContent
      initialData={result.ok ? result.data : null}
      initialError={result.ok ? undefined : result.message}
    />
  );
}
