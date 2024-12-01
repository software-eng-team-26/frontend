export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
    };
  };
} 