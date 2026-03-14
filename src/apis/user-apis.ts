import { RegisterRequest } from '@/interfaces/auth-interfaces';
import { UserResponse } from '@/interfaces/user-interfaces';
import { wireApi } from 'fetchwire';

export const registerApi = async (payload: RegisterRequest) => {
  const response = await wireApi<UserResponse>('/user/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
};

export const getCurrentUserApi = async () => {
  const response = await wireApi<UserResponse>('/user/me', {
    method: 'GET',
  });
  return response;
};
