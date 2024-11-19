const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9191/api/v1';

export interface ApiResponse<T> {
  message: string;
  data: T | null;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  // Add other user fields as needed
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  // Add other updateable fields
}

export interface SignInRequest {
  email: string;
  password: string;
}

export const userApi = {
  async getUserById(userId: number): Promise<ApiResponse<UserDto>> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/user`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async createUser(request: CreateUserRequest): Promise<ApiResponse<UserDto>> {
    const response = await fetch(`${API_BASE_URL}/users/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async updateUser(userId: number, request: UserUpdateRequest): Promise<ApiResponse<UserDto>> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async deleteUser(userId: number): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/delete`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async signIn(request: SignInRequest): Promise<ApiResponse<UserDto>> {
    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
}; 