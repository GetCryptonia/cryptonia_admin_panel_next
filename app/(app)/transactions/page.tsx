import FeaturePageSkeleton from "@/components/skeleton/feature_page_skeleton";

export default function TransactionsPage() {
  return (
    <FeaturePageSkeleton
      title="Transactions"
      variant="table"
      tableColumns={7}
      tableRows={10}
    />
  );
}
