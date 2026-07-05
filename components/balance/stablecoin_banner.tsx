import Image from "next/image";
import { formatStablecoinAmount } from "@/lib/features/balances/utils";

type StablecoinBannerProps = {
  total: number;
};

export default function StablecoinBanner({ total }: StablecoinBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-[16px]">
      <Image
        src="/balance-bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />

      <div className="relative flex min-h-[140px] items-center justify-center px-[24px] py-[28px] md:min-h-[160px] md:px-[32px]">
        <div className="flex flex-col items-center gap-[8px] text-center">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-white/70">
            Stablecoin Balance
          </p>
          <p className="text-[32px] font-semibold leading-none text-white md:text-[40px]">
            {formatStablecoinAmount(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
