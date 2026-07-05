import SkeletonCardsLayout from "./skeleton_cards_layout";
import SkeletonSetupLayout from "./skeleton_setup_layout";
import SkeletonTableLayout from "./skeleton_table_layout";
import Skeleton from "./skeleton";

export type FeatureSkeletonVariant = "cards" | "table" | "setup";

type FeaturePageSkeletonProps = {
  title: string;
  variant: FeatureSkeletonVariant;
  tableRows?: number;
  tableColumns?: number;
};

export default function FeaturePageSkeleton({
  title,
  variant,
  tableRows,
  tableColumns,
}: FeaturePageSkeletonProps) {
  return (
    <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
      <div className="flex flex-col gap-[8px]">
        <h1 className="sr-only">{title}</h1>
        <Skeleton className="h-[28px] w-[180px] md:hidden" />
      </div>

      {variant === "cards" && <SkeletonCardsLayout />}
      {variant === "table" && (
        <SkeletonTableLayout rows={tableRows} columns={tableColumns} />
      )}
      {variant === "setup" && <SkeletonSetupLayout />}
    </div>
  );
}
