import Skeleton from "./skeleton";

export default function SkeletonSetupLayout() {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`rate-${index}`}
            className="rounded-[16px] border border-divider-color p-[20px]"
          >
            <Skeleton className="mb-[16px] h-[18px] w-[120px]" />
            <div className="flex flex-col gap-[12px]">
              <Skeleton className="h-[44px] w-full" />
              <Skeleton className="h-[44px] w-full" />
              <Skeleton className="h-[36px] w-[140px]" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[16px] border border-divider-color p-[20px]">
        <div className="mb-[20px] flex flex-row items-center justify-between gap-[12px]">
          <Skeleton className="h-[18px] w-[180px]" />
          <Skeleton className="h-[36px] w-[120px]" />
        </div>

        <div className="flex flex-col gap-[12px]">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={`fee-${index}`} className="h-[52px] w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
