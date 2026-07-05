import CustomersContent from "@/components/customers/customers_content";
import * as service from "@/lib/features/customers/service";

export default async function CustomersPage() {
  const data = await service.getCustomers();

  return <CustomersContent initialData={data} />;
}
