import { LoginRequest, LoginResponse } from '@/interfaces/auth-interfaces';
import { wireApi } from 'fetchwire';

export async function loginApi(data: LoginRequest) {
    return wireApi<LoginResponse>('/auth/local', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}
