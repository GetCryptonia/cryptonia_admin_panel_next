import Skeleton from "@/components/skeleton/skeleton";

export default function SetupSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-divider-color px-[24px] py-[20px] md:px-[48px] md:py-[24px]">
        <Skeleton className="hidden h-[28px] w-[100px] md:block" />
      </div>

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <div className="flex flex-row flex-wrap gap-[12px]">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={`tab-${index}`}
              className="h-[36px] w-[140px] rounded-[10px]"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`rate-${index}`}
              className="rounded-[16px] border border-divider-color p-[20px]"
            >
              <Skeleton className="mb-[16px] h-[44px] w-[120px]" />
              <div className="flex flex-col gap-[12px]">
                <Skeleton className="h-[44px] w-full" />
                <Skeleton className="h-[44px] w-full" />
                <Skeleton className="h-[36px] w-[140px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
