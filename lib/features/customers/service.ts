import { apiRequest } from "@/lib/api/client";
import type { PageParams } from "@/lib/api/types";
import type {
  Customer,
  CustomerDetails,
  PaginatedCustomers,
} from "./types";
import { normalizeCustomer } from "./utils";

type CustomerApiRecord = Customer & { _id?: string };

type SearchCustomersResponse =
  | PaginatedCustomers
  | CustomerApiRecord[]
  | CustomerApiRecord;

function normalizePaginatedCustomers(
  data: SearchCustomersResponse,
  page = 1,
): PaginatedCustomers {
  if (Array.isArray(data)) {
    const customers = data.map(normalizeCustomer);
    return {
      customers,
      currentPage: page,
      totalPages: customers.length > 0 ? 1 : 0,
      totalCustomers: customers.length,
    };
  }

  if (data && typeof data === "object" && "customers" in data) {
    return {
      ...data,
      customers: (data.customers ?? []).map(normalizeCustomer),
      currentPage: data.currentPage ?? page,
      totalPages: data.totalPages ?? 1,
      totalCustomers: data.totalCustomers ?? data.customers?.length ?? 0,
    };
  }

  const customer = normalizeCustomer(data);
  return {
    customers: customer.id ? [customer] : [],
    currentPage: page,
    totalPages: customer.id ? 1 : 0,
    totalCustomers: customer.id ? 1 : 0,
  };
}

export async function getCustomers(
  params?: PageParams,
): Promise<PaginatedCustomers> {
  const data = await apiRequest<PaginatedCustomers>("/admin-panel/customers", {
    query: params,
  });

  return normalizePaginatedCustomers(data, params?.page);
}

export async function searchCustomers(
  query: string,
  params?: PageParams,
): Promise<PaginatedCustomers> {
  const data = await apiRequest<SearchCustomersResponse>(
    "/admin-panel/customers/search",
    {
      query: { query, ...params },
    },
  );

  return normalizePaginatedCustomers(data, params?.page);
}

export async function getCustomerDetails(
  customerId: string,
): Promise<CustomerDetails> {
  return apiRequest<CustomerDetails>(`/admin-panel/customers/${customerId}`);
}

export async function toggleCustomerBlock(customerId: string): Promise<Customer> {
  const customer = await apiRequest<Customer & { _id?: string }>(
    `/admin-panel/customers/${customerId}`,
    { method: "PUT" },
  );

  return normalizeCustomer(customer);
}
