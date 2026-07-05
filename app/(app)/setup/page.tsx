import SetupContent from "@/components/setup/setup_content";
import * as service from "@/lib/features/setup/service";

export default async function SetupPage() {
  const [rates, fees] = await Promise.all([
    service.getRates(),
    service.getTransactionFees(),
  ]);

  return <SetupContent initialRates={rates} initialFees={fees} />;
}
