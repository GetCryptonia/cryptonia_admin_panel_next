import Skeleton from "./skeleton";

type SkeletonTableLayoutProps = {
  rows?: number;
  columns?: number;
  showFilters?: boolean;
};

export default function SkeletonTableLayout({
  rows = 8,
  columns = 6,
  showFilters = true,
}: SkeletonTableLayoutProps) {
  return (
    <div className="flex flex-col gap-[20px]">
      {showFilters && (
        <div className="flex flex-col gap-[12px] sm:flex-row sm:items-center">
          <Skeleton className="h-[44px] w-full max-w-[420px]" />
          <Skeleton className="h-[44px] w-full max-w-[180px]" />
        </div>
      )}

      <div className="overflow-hidden rounded-[16px] border border-divider-color">
        <div className="grid gap-[1px] bg-divider-color p-[1px]">
          <div
            className="grid bg-background px-[20px] py-[16px]"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={`header-${index}`} className="h-[14px] w-[70%]" />
            ))}
          </div>

          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid bg-background px-[20px] py-[18px]"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${columnIndex}`}
                  className={`h-[14px] ${columnIndex === 0 ? "w-[85%]" : "w-[60%]"}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
