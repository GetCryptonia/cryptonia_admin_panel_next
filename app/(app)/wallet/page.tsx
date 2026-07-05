import FeaturePageSkeleton from "@/components/skeleton/feature_page_skeleton";

export default function WalletPage() {
  return (
    <FeaturePageSkeleton
      title="Wallet"
      variant="table"
      tableColumns={6}
      tableRows={10}
    />
  );
}
