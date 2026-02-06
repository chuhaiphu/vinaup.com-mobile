import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./auth-provider";
import { getOrganizationsOfCurrentUserApi } from "@/apis/organization-apis";
import { OrganizationResponse } from "@/interfaces/organization-interfaces";

export interface OrganizationContextType {
  organizations: OrganizationResponse[];
  loading: boolean;
  refresh: () => void;
}

export const OrganizationContext = createContext<OrganizationContextType>({
  organizations: [],
  loading: false,
  refresh: () => { },
});

export const OrganizationProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useContext(AuthContext);
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