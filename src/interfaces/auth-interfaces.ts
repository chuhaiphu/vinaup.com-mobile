import { UserResponse } from "./user-interfaces";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  province?: string;
  avatarUrl?: string;
}