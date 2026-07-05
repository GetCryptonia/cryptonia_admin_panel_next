import WalletContent from "@/components/wallet/wallet_content";
import * as service from "@/lib/features/wallets/service";

export default async function WalletPage() {
  const data = await service.getWallets();

  return <WalletContent initialData={data} />;
}
