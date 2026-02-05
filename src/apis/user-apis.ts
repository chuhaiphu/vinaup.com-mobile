import { RegisterRequest } from "@/interfaces/auth-interfaces";
import { UserResponse } from "@/interfaces/user-interfaces";
import { api } from "./_base";

export const registerApi = async (payload: RegisterRequest) => {
  const response = await api<UserResponse>('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
};

export const getCurrentUserApi = async () => {
  const response = await api<UserResponse>('/user/me', {
    method: 'GET',
  });
  return response;
};