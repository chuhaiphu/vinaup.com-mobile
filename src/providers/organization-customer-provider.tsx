import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getOrganizationCustomersByOrganizationIdApi } from '@/apis/organization-apis';
import { OrganizationCustomerResponse } from '@/interfaces/organization-customer-interfaces';

interface OrganizationCustomerContextType {
  organizationCustomers: OrganizationCustomerResponse[];
  isLoadingOrganizationCustomers: boolean;
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
  const [organizationCustomers, setOrganizationCustomers] = useState<
    OrganizationCustomerResponse[]
  >([]);
  const [isLoadingOrganizationCustomers, setIsLoadingOrganizationCustomers] = useState(false);

  const fetchOrganizationCustomers = useCallback(async () => {
    if (!organizationId) {
      setOrganizationCustomers([]);
      return;
    }
    setIsLoadingOrganizationCustomers(true);
    try {
      const response = await getOrganizationCustomersByOrganizationIdApi(organizationId);
      if (response.data) {
        setOrganizationCustomers(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách khách hàng tổ chức:', error);
    } finally {
      setIsLoadingOrganizationCustomers(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchOrganizationCustomers();
  }, [fetchOrganizationCustomers]);

  return (
    <OrganizationCustomerContext
      value={{
        organizationCustomers,
        isLoadingOrganizationCustomers,
        refreshOrganizationCustomers: fetchOrganizationCustomers,
      }}
    >
      {children}
    </OrganizationCustomerContext>
  );
}
