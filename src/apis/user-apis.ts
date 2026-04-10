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

export const searchUsersApi = async (params: {
  name?: string;
  phone?: string;
  email?: string;
}) => {
  const query = new URLSearchParams();
  if (params.name) query.set('name', params.name);
  if (params.phone) query.set('phone', params.phone);
  if (params.email) query.set('email', params.email);
  return wireApi<UserResponse[]>(`/user/search?${query.toString()}`, {
    method: 'GET',
  });
};
