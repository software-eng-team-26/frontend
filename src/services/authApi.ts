import { api } from './api';
import { AuthResponse } from '../types/auth';

interface SignInRequest {
  email: string;
  password: string;
}

export const authApi = {
  async signIn(data: SignInRequest) {
    return api.post<AuthResponse>('/users/signin', data);
  },

  async signUp(data: SignInRequest & { firstName: string; lastName: string }) {
    return api.post<AuthResponse>('/users/add', data);
  }
}; 