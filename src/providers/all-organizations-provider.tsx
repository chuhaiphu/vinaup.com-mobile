import { createContext, useContext, useEffect } from 'react';
import { useFetchFn } from 'fetchwire';
import { useAuthContext } from './auth-provider';
import { getAllOrganizationsApi } from '@/apis/organization-apis';
import { OrganizationResponse } from '@/interfaces/organization-interfaces';

interface AllOrganizationsContextType {
  allOrganizations: OrganizationResponse[];
  isLoadingAllOrganizations: boolean;
  isRefreshingAllOrganizations: boolean;
  refreshAllOrganizations: () => void;
}

const AllOrganizationsContext = createContext<AllOrganizationsContextType | null>(null);

export function useAllOrganizationsContext() {
  const ctx = useContext(AllOrganizationsContext);
  if (!ctx)
    throw new Error(
      'useAllOrganizationsContext must be used within AllOrganizationsProvider'
    );
  return ctx;
}

export function AllOrganizationsProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthContext();

  const {
    data: allOrganizations,
    isLoading: isLoadingAllOrganizations,
    isRefreshing: isRefreshingAllOrganizations,
    executeFetchFn: fetchAllOrganizations,
    refreshFetchFn: refreshAllOrganizations,
  } = useFetchFn(() => getAllOrganizationsApi(), {
    fetchKey: 'all-organizations',
    tags: ['all-organizations'],
  });

  useEffect(() => {
    if (currentUser?.id) {
      fetchAllOrganizations();
    }
  }, [currentUser?.id, fetchAllOrganizations]);

  return (
    <AllOrganizationsContext
      value={{
        allOrganizations: allOrganizations ?? [],
        isLoadingAllOrganizations,
        isRefreshingAllOrganizations,
        refreshAllOrganizations,
      }}
    >
      {children}
    </AllOrganizationsContext>
  );
}
