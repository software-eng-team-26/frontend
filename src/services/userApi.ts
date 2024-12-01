import { api } from './api';

export interface UserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export const userApi = {
  async signIn(credentials: SignInRequest) {
    const response = await api.post<ApiResponse<AuthResponse>>('/users/signin', credentials);
    console.log('API response:', response.data);
    return response;
  },

  async signUp(data: SignUpRequest) {
    const response = await api.post<ApiResponse<AuthResponse>>('/users/add', data);
    return response;
  },

  async getCurrentUser() {
    const response = await api.get<UserDto>('/users/me');
    return response.data;
  },

  async updateUser(userId: number, data: Partial<UserDto>) {
    const response = await api.put<UserDto>(`/users/${userId}/update`, data);
    return response.data;
  }
}; 