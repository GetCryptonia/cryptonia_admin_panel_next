import Skeleton from "@/components/skeleton/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-[16px] border-b border-divider-color px-[24px] py-[20px] md:flex-row md:items-center md:justify-between md:px-[48px] md:py-[24px]">
        <Skeleton className="hidden h-[28px] w-[160px] md:block" />
        <div className="flex flex-row flex-wrap items-center gap-[10px]">
          <Skeleton className="h-[42px] w-[280px] rounded-[12px]" />
          <Skeleton className="h-[42px] w-[110px] rounded-[12px]" />
        </div>
      </div>

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <div className="flex flex-row gap-[12px]">
          <Skeleton className="h-[40px] w-[100px] rounded-full" />
          <Skeleton className="h-[40px] w-[100px] rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-[20px] xl:grid-cols-[1.6fr_1fr]">
          <Skeleton className="min-h-[320px]" />
          <Skeleton className="min-h-[320px]" />
        </div>

        <div className="flex flex-row gap-[12px]">
          <Skeleton className="h-[36px] w-[130px] rounded-full" />
          <Skeleton className="h-[36px] w-[170px] rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="min-h-[160px]" />
          ))}
        </div>
      </div>
    </div>
  );
}
