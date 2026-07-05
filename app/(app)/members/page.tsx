import FeaturePageSkeleton from "@/components/skeleton/feature_page_skeleton";

export default function MembersPage() {
  return (
    <FeaturePageSkeleton
      title="Members"
      variant="table"
      tableColumns={4}
      tableRows={6}
    />
  );
}
