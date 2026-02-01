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