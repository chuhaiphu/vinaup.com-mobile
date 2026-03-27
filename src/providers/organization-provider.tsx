import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./auth-provider";
import { getOrganizationsOfCurrentUserApi } from "@/apis/organization-apis";
import { OrganizationResponse } from "@/interfaces/organization-interfaces";

interface OrganizationContextType {
  organizations: OrganizationResponse[];
  loading: boolean;
  refresh: () => void;
}

const OrganizationContext = createContext<OrganizationContextType>({
  organizations: [],
  loading: false,
  refresh: () => { },
});

export function useOrganizationContext() {
  return useContext(OrganizationContext);
}

export const OrganizationProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuthContext();
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      getOrganizationsOfCurrentUser();
    } else {
      setOrganizations([]);
    }
  }, [currentUser?.id]);

  const getOrganizationsOfCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await getOrganizationsOfCurrentUserApi();
      if (response.data) {
        setOrganizations(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tổ chức:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrganizationContext value={{ organizations, loading, refresh: getOrganizationsOfCurrentUser }}>
      {children}
    </OrganizationContext>
  );
};