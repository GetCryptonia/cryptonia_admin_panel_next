"use server";

import { revalidatePath } from "next/cache";
import { toActionResult } from "@/lib/api/action_utils";
import type { ActionResult, PageParams } from "@/lib/api/types";
import type {
  Customer,
  CustomerDetails,
  PaginatedCustomers,
} from "./types";
import * as service from "./service";

export async function fetchCustomersAction(
  params?: PageParams,
): Promise<ActionResult<PaginatedCustomers>> {
  return toActionResult(() => service.getCustomers(params));
}

export async function searchCustomersAction(
  query: string,
  params?: PageParams,
): Promise<ActionResult<PaginatedCustomers>> {
  return toActionResult(() => service.searchCustomers(query, params));
}

export async function fetchCustomerDetailsAction(
  customerId: string,
): Promise<ActionResult<CustomerDetails>> {
  return toActionResult(() => service.getCustomerDetails(customerId));
}

export async function toggleCustomerBlockAction(
  customerId: string,
): Promise<ActionResult<Customer>> {
  const result = await toActionResult(() =>
    service.toggleCustomerBlock(customerId),
  );
  if (result.ok) revalidatePath("/customers");
  return result;
}
