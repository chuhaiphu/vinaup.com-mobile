import { createContext, useContext, useEffect } from 'react';
import { useFetchFn } from 'fetchwire';
import { useAuthContext } from './auth-provider';
import { getOrganizationsOfCurrentUserApi } from '@/apis/organization/organization';
import { OrganizationResponse } from '@/interfaces/organization-interfaces';

interface OrganizationContextType {
  organizations: OrganizationResponse[];
  isLoadingOrganizations: boolean;
  isRefreshingOrganizations: boolean;
  refreshOrganizations: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | null>(null);

export function useOrganizationContext() {
  const ctx = useContext(OrganizationContext);
  if (!ctx)
    throw new Error(
      'useOrganizationContext must be used within OrganizationProvider'
    );
  return ctx;
}

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthContext();

  const {
    data: organizations,
    isLoading: isLoadingOrganizations,
    isRefreshing: isRefreshingOrganizations,
    executeFetchFn: fetchOrganizations,
    refreshFetchFn: refreshOrganizations,
  } = useFetchFn(() => getOrganizationsOfCurrentUserApi(), {
    fetchKey: 'organizations',
    tags: ['organizations'],
  });

  useEffect(() => {
    if (currentUser?.id) {
      fetchOrganizations();
    }
  }, [currentUser?.id, fetchOrganizations]);

  return (
    <OrganizationContext
      value={{
        organizations: organizations ?? [],
        isLoadingOrganizations,
        isRefreshingOrganizations,
        refreshOrganizations,
      }}
    >
      {children}
    </OrganizationContext>
  );
}