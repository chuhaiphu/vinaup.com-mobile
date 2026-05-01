import { RegisterRequest } from '@/interfaces/auth-interfaces';
import { UserResponse } from '@/interfaces/user-interfaces';
import { generateFilterQueryString } from '@/utils/generator/string-generator/generate-filter-query-string';
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

export async function searchUsersApi(params: { name?: string; phone?: string; email?: string }) {
  const qs = generateFilterQueryString(undefined, { name: params.name, phone: params.phone, email: params.email });
  return wireApi<UserResponse[]>(`/user/search${qs}`, { method: 'GET' });
}
