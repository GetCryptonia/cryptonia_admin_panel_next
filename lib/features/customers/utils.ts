import type { Customer } from "./types";

type CustomerApiResponse = Customer & { _id?: string };

export function normalizeCustomer(customer: CustomerApiResponse): Customer {
  if (customer.id) {
    return customer;
  }

  return {
    ...customer,
    id: customer._id ?? "",
  };
}

export function getCustomerDisplayName(customer: Customer): string {
  const parts = [customer.firstName, customer.middleName, customer.lastName]
    .filter(Boolean)
    .map((part) => part?.trim())
    .filter(Boolean);

  if (parts.length > 0) {
    return parts.join(" ");
  }

  return customer.username;
}

export function getCustomerStatusLabel(active: boolean): string {
  return active ? "Active" : "Blocked";
}

export function getCustomerStatusClass(active: boolean): string {
  return active
    ? "bg-success-color/10 text-success-color"
    : "bg-primary/10 text-primary";
}
