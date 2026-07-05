import BalanceContent from "@/components/balance/balance_content";
import * as service from "@/lib/features/balances/service";

export default async function BalancePage() {
  const data = await service.getBalances();

  return <BalanceContent initialData={data} />;
}
