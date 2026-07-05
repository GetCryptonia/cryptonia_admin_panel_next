import Skeleton from "./skeleton";

type SkeletonCardsLayoutProps = {
  heroCards?: number;
  statCards?: number;
};

export default function SkeletonCardsLayout({
  heroCards = 2,
  statCards = 3,
}: SkeletonCardsLayoutProps) {
  return (
    <div className="flex flex-col gap-[24px]">
      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-2">
        {Array.from({ length: heroCards }).map((_, index) => (
          <Skeleton key={`hero-${index}`} className="min-h-[220px]" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
        {Array.from({ length: statCards }).map((_, index) => (
          <Skeleton key={`stat-${index}`} className="min-h-[140px]" />
        ))}
      </div>
    </div>
  );
}
