"use client";

import CustomerDetailsPanel, {
  CustomerDetailsBlockAction,
} from "@/components/customers/customer_details_panel";
import CountBadge from "@/components/shared/count_badge";
import DataTableContainer, {
  TABLE_HEAD_CLASS,
  TABLE_ROW_CLASS,
  TABLE_ROW_INTERACTIVE_CLASS,
  TABLE_TD_CLASS,
  TABLE_TH_CLASS,
} from "@/components/shared/data_table";
import DetailDrawer from "@/components/shared/detail_drawer";
import EmptyState from "@/components/shared/empty_state";
import PageHeader from "@/components/shared/page_header";
import PageToolbar from "@/components/shared/page_toolbar";
import PaginationControls from "@/components/shared/pagination_controls";
import SearchInput from "@/components/shared/search_input";
import { redirectIfUnauthorized } from "@/lib/api/client_action_utils";
import {
  fetchCustomerDetailsAction,
  fetchCustomersAction,
  searchCustomersAction,
} from "@/lib/features/customers/actions";
import type {
  Customer,
  CustomerDetails,
  PaginatedCustomers,
} from "@/lib/features/customers/types";
import {
  getCustomerDisplayName,
  getCustomerStatusClass,
  getCustomerStatusLabel,
} from "@/lib/features/customers/utils";
import { formatDate, formatDateTime } from "@/lib/format";
import { useEffect, useRef, useState, useTransition } from "react";

type CustomersContentProps = {
  initialData: PaginatedCustomers;
};

export default function CustomersContent({ initialData }: CustomersContentProps) {
  const [customers, setCustomers] = useState(initialData.customers);
  const [totalCustomers, setTotalCustomers] = useState(initialData.totalCustomers);
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [detailsByCustomerId, setDetailsByCustomerId] = useState<
    Record<string, CustomerDetails>
  >({});
  const [loadingDetailsId, setLoadingDetailsId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const skipInitialFetchRef = useRef(true);

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (skipInitialFetchRef.current) {
      skipInitialFetchRef.current = false;
      return;
    }

    startTransition(async () => {
      const result = debouncedQuery
        ? await searchCustomersAction(debouncedQuery, { page: currentPage })
        : await fetchCustomersAction({ page: currentPage });

      if (redirectIfUnauthorized(result)) {
        return;
      }

      if (!result.ok) {
        setError(result.message);
        return;
      }

      setCustomers(result.data.customers);
      setTotalCustomers(result.data.totalCustomers);
      setCurrentPage(result.data.currentPage);
      setTotalPages(result.data.totalPages);
      setError(null);
    });
  }, [debouncedQuery, currentPage]);

  const handleOpenCustomer = async (customerId: string) => {
    setSelectedCustomerId(customerId);
    setError(null);

    if (detailsByCustomerId[customerId]) {
      return;
    }

    setLoadingDetailsId(customerId);
    const result = await fetchCustomerDetailsAction(customerId);

    if (redirectIfUnauthorized(result)) {
      setLoadingDetailsId(null);
      return;
    }

    if (!result.ok) {
      setError(result.message);
      setLoadingDetailsId(null);
      return;
    }

    setDetailsByCustomerId((current) => ({
      ...current,
      [customerId]: result.data,
    }));
    setLoadingDetailsId(null);
  };

  const handleCloseDrawer = () => {
    setSelectedCustomerId(null);
  };

  const handleCustomerUpdated = (updatedCustomer: Customer) => {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer,
      ),
    );
  };

  const handlePageChange = (page: number) => {
    setSelectedCustomerId(null);
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col">
      <PageHeader title="Customers" />

      <div className="flex flex-col gap-[24px] p-[24px] md:p-[48px]">
        <PageToolbar
          meta={
            <CountBadge count={totalCustomers} label="total customers" />
          }
        >
          <SearchInput
            value={searchQuery}
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
              setSelectedCustomerId(null);
            }}
            placeholder="Search by username, name, or phone"
          />
        </PageToolbar>

        {error ? (
          <div className="rounded-[12px] border border-primary/30 bg-primary/5 px-[16px] py-[12px] text-sm text-primary">
            {error}
          </div>
        ) : null}

        <DataTableContainer minWidth="1100px">
          <thead className={TABLE_HEAD_CLASS}>
            <tr>
              <th className={TABLE_TH_CLASS}>Username</th>
              <th className={TABLE_TH_CLASS}>Email</th>
              <th className={TABLE_TH_CLASS}>First name</th>
              <th className={TABLE_TH_CLASS}>Middle name</th>
              <th className={TABLE_TH_CLASS}>Last name</th>
              <th className={TABLE_TH_CLASS}>Phone</th>
              <th className={TABLE_TH_CLASS}>Date joined</th>
              <th className={TABLE_TH_CLASS}>Last login</th>
              <th className={TABLE_TH_CLASS}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => {
              const isSelected = selectedCustomerId === customer.id;

              return (
                <tr
                  key={customer.id}
                  onClick={() => handleOpenCustomer(customer.id)}
                  className={`${TABLE_ROW_CLASS} ${TABLE_ROW_INTERACTIVE_CLASS} ${
                    isSelected ? "bg-divider-color/30" : ""
                  }`}
                >
                  <td className={`${TABLE_TD_CLASS} font-medium`}>
                    {customer.username}
                  </td>
                  <td className={TABLE_TD_CLASS}>{customer.email}</td>
                  <td className={TABLE_TD_CLASS}>{customer.firstName ?? "—"}</td>
                  <td className={TABLE_TD_CLASS}>{customer.middleName || "—"}</td>
                  <td className={TABLE_TD_CLASS}>{customer.lastName ?? "—"}</td>
                  <td className={TABLE_TD_CLASS}>{customer.phone ?? "—"}</td>
                  <td className={`${TABLE_TD_CLASS} text-hint-text-color`}>
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className={`${TABLE_TD_CLASS} text-hint-text-color`}>
                    {formatDateTime(customer.lastLogin)}
                  </td>
                  <td className={TABLE_TD_CLASS}>
                    <span
                      className={`rounded-full px-[10px] py-[4px] text-xs font-semibold ${getCustomerStatusClass(customer.active)}`}
                    >
                      {getCustomerStatusLabel(customer.active)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTableContainer>

        {customers.length === 0 && !isPending ? (
          <EmptyState message="No customers found." />
        ) : null}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={isPending}
        />
      </div>

      <DetailDrawer
        isOpen={selectedCustomerId !== null}
        onClose={handleCloseDrawer}
        title={
          selectedCustomer
            ? getCustomerDisplayName(selectedCustomer)
            : "Customer details"
        }
        headerMeta={
          selectedCustomer ? (
            <span
              className={`rounded-full px-[12px] py-[4px] text-xs font-semibold ${getCustomerStatusClass(selectedCustomer.active)}`}
            >
              {getCustomerStatusLabel(selectedCustomer.active)}
            </span>
          ) : null
        }
        footer={
          selectedCustomer ? (
            <CustomerDetailsBlockAction
              customer={selectedCustomer}
              onCustomerUpdated={handleCustomerUpdated}
              onError={setError}
            />
          ) : null
        }
      >
        {selectedCustomerId && loadingDetailsId === selectedCustomerId ? (
          <div className="px-[24px] py-[32px] text-sm text-hint-text-color">
            Loading customer details...
          </div>
        ) : selectedCustomer &&
          selectedCustomerId &&
          detailsByCustomerId[selectedCustomerId] ? (
          <CustomerDetailsPanel
            details={detailsByCustomerId[selectedCustomerId]}
          />
        ) : null}
      </DetailDrawer>
    </div>
  );
}
