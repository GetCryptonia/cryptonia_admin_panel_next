import Skeleton from "./skeleton";

export default function BalanceSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="hidden border-b border-divider-color px-[24px] py-[20px] md:block md:px-[48px] md:py-[24px]">
        <Skeleton className="h-[28px] w-[120px]" />
      </div>

      <div className="flex flex-col gap-[32px] p-[24px] md:p-[48px]">
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`fiat-${index}`} className="min-h-[160px]" />
          ))}
        </div>

        <div className="flex flex-col gap-[20px]">
          <Skeleton className="h-[24px] w-[140px]" />
          <Skeleton className="min-h-[160px]" />
          <div className="flex flex-row flex-wrap gap-[12px]">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={`tab-${index}`} className="h-[36px] w-[120px] rounded-full" />
            ))}
          </div>
          <Skeleton className="min-h-[280px]" />
        </div>
      </div>
    </div>
  );
}
