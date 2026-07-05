import FeaturePageSkeleton from "@/components/skeleton/feature_page_skeleton";

export default function CustomersPage() {
  return (
    <FeaturePageSkeleton
      title="Customers"
      variant="table"
      tableColumns={7}
      tableRows={10}
    />
  );
}
