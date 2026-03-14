import { LoginResponse } from "@/interfaces/auth-interfaces";
import { wireApi } from "fetchwire";
export const loginApi = async (email: string, password: string) => {
  const response = await wireApi<LoginResponse>('/auth/local', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response;
};