import { createContext, useContext, useEffect } from 'react';
import { useFetchFn } from 'fetchwire';
import { getOrganizationCustomersByOrganizationIdApi } from '@/apis/organization-apis';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';

interface OrganizationCustomerContextType {
  organizationCustomers: OrganizationCustomerResponse[];
  isLoadingOrganizationCustomers: boolean;
  isRefreshingOrganizationCustomers: boolean;
  refreshOrganizationCustomers: () => void;
}

const OrganizationCustomerContext = createContext<OrganizationCustomerContextType | null>(null);

export function useOrganizationCustomerContext() {
  const ctx = useContext(OrganizationCustomerContext);
  if (!ctx)
    throw new Error(
      'useOrganizationCustomerContext must be used within OrganizationCustomerProvider'
    );
  return ctx;
}

export function OrganizationCustomerProvider({
  organizationId,
  children,
}: {
  organizationId: string | undefined;
  children: React.ReactNode;
}) {
  const {
    data: organizationCustomers,
    isLoading: isLoadingOrganizationCustomers,
    isRefreshing: isRefreshingOrganizationCustomers,
    executeFetchFn: fetchOrganizationCustomers,
    refreshFetchFn: refreshOrganizationCustomers,
  } = useFetchFn(
    () => getOrganizationCustomersByOrganizationIdApi(organizationId!),
    {
      fetchKey: `organization-customers-${organizationId}`,
      tags: [`organization-customers-${organizationId}`],
    }
  );

  useEffect(() => {
    if (organizationId) {
      fetchOrganizationCustomers();
    }
  }, [organizationId, fetchOrganizationCustomers]);

  return (
    <OrganizationCustomerContext
      value={{
        organizationCustomers: organizationCustomers ?? [],
        isLoadingOrganizationCustomers,
        isRefreshingOrganizationCustomers,
        refreshOrganizationCustomers,
      }}
    >
      {children}
    </OrganizationCustomerContext>
  );
}
