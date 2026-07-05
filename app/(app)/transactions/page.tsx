import TransactionsContent from "@/components/transactions/transactions_content";
import * as service from "@/lib/features/transactions/service";

export default async function TransactionsPage() {
  const data = await service.getTransactions();

  return <TransactionsContent initialData={data} />;
}
