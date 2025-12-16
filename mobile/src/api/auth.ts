import api from './client';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    phone: string;
    fullName: string;
  };
}

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post('/api/user/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await api.post('/api/user/register', data);
  return response.data;
};

export interface ForgotPasswordRequest {
  phone: string;
}

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  const response = await api.post('/api/user/forgot-password', data);
  return response.data;
};
