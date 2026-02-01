import { LoginResponse } from "@/interfaces/auth-interfaces";
import { api } from "./_base";

export const loginApi = async (email: string, password: string) => {
  const response = await api<LoginResponse>('/auth/local', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response;
};