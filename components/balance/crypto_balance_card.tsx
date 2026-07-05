import Image from "next/image";
import {
  formatStablecoinAmount,
  getCryptoTokenAssetPath,
} from "@/lib/features/balances/utils";
import type { ParsedCryptoBalance } from "@/lib/features/balances/utils";

type CryptoBalanceCardProps = {
  balance: ParsedCryptoBalance;
};

export default function CryptoBalanceCard({ balance }: CryptoBalanceCardProps) {
  return (
    <div className="flex flex-row items-center gap-[14px] rounded-[14px] bg-divider-color/70 p-[16px]">
      <Image
        src={getCryptoTokenAssetPath(balance.token, balance.network)}
        alt={`${balance.token} on ${balance.displayNetwork}`}
        width={48}
        height={40}
        className="h-[40px] w-[48px] shrink-0 object-contain"
      />

      <div className="min-w-0 flex flex-col gap-[4px]">
        <p className="truncate text-sm text-hint-text-color">
          {balance.token} ({balance.displayNetwork})
        </p>
        <p className="text-lg font-semibold leading-none">
          {formatStablecoinAmount(balance.numericBalance)}
        </p>
      </div>
    </div>
  );
}
