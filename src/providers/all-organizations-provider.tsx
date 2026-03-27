import { createContext, useContext, useEffect, useState } from 'react';
import { useAuthContext } from './auth-provider';
import { getAllOrganizationsApi } from '@/apis/organization-apis';
import { OrganizationResponse } from '@/interfaces/organization-interfaces';

interface AllOrganizationsContextType {
  allOrganizations: OrganizationResponse[];
  loading: boolean;
  refresh: () => void;
}

const AllOrganizationsContext = createContext<AllOrganizationsContextType>({
  allOrganizations: [],
  loading: false,
  refresh: () => {},
});

export function useAllOrganizationsContext() {
  return useContext(AllOrganizationsContext);
}

export function AllOrganizationsProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthContext();
  const [allOrganizations, setAllOrganizations] = useState<OrganizationResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      fetchAllOrganizations();
    } else {
      setAllOrganizations([]);
    }
  }, [currentUser?.id]);

  const fetchAllOrganizations = async () => {
    setLoading(true);
    try {
      const response = await getAllOrganizationsApi();
      if (response.data) {
        setAllOrganizations(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tất cả tổ chức:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AllOrganizationsContext
      value={{ allOrganizations, loading, refresh: fetchAllOrganizations }}
    >
      {children}
    </AllOrganizationsContext>
  );
}
