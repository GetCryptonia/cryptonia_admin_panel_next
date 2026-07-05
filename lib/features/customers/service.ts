import { apiRequest } from "@/lib/api/client";
import type { PageParams } from "@/lib/api/types";
import type {
  Customer,
  CustomerDetails,
  PaginatedCustomers,
} from "./types";

export async function getCustomers(
  params?: PageParams,
): Promise<PaginatedCustomers> {
  return apiRequest<PaginatedCustomers>("/admin-panel/customers", {
    query: params,
  });
}

export async function searchCustomers(
  query: string,
  params?: PageParams,
): Promise<PaginatedCustomers> {
  return apiRequest<PaginatedCustomers>("/admin-panel/customers/search", {
    query: { query, ...params },
  });
}

export async function getCustomerDetails(
  customerId: string,
): Promise<CustomerDetails> {
  return apiRequest<CustomerDetails>(`/admin-panel/customers/${customerId}`);
}

export async function toggleCustomerBlock(customerId: string): Promise<Customer> {
  return apiRequest<Customer>(`/admin/customers/${customerId}`, {
    method: "PUT",
  });
}
