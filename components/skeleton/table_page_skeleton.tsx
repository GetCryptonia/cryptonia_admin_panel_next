import PageHeader from "@/components/shared/page_header";
import SkeletonTableLayout from "@/components/skeleton/skeleton_table_layout";

export default function TablePageSkeleton({ title }: { title: string }) {
  return (
    <div className="flex flex-col">
      <PageHeader title={title} />
      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <SkeletonTableLayout rows={10} columns={6} />
      </div>
    </div>
  );
}
