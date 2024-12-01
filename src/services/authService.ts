import { api } from './api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const response = await api.post('/users/signin', credentials);
    return response.data;
  },

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const response = await api.post('/users/add', credentials);
    return response.data;
  },

  async signOut() {
    // Clear any server-side session if needed
    return Promise.resolve();
  }
}; 