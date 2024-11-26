import { ApiResponse } from './api';

export interface ProductDto {
  id: number;
  name: string;
  brand: string;
  price: number;
  inventory: number;
  description: string;
  level: number;
  duration: number;
  moduleCount: number;
  certification: boolean;
  instructorName: string;
  instructorRole: string;
  thumbnailUrl: string;
  curriculum: string[];
  category: {
    id: number;
    name: string;
  };
  images: {
    id: number;
    downloadUrl: string;
    fileName: string;
    fileType: string;
  }[];
  featured: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9191/api/v1';

export const productApi = {
  async getAllProducts(): Promise<ApiResponse<ProductDto[]>> {
    const response = await fetch(`${API_BASE_URL}/products/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getProductById(productId: number): Promise<ApiResponse<ProductDto>> {
    const response = await fetch(`${API_BASE_URL}/products/product/${productId}/product`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getProductsByCategory(category: string): Promise<ApiResponse<ProductDto[]>> {
    const response = await fetch(`${API_BASE_URL}/products/product/${category}/all/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async getProductsByInstructor(instructorName: string): Promise<ApiResponse<ProductDto[]>> {
    const response = await fetch(`${API_BASE_URL}/products/products/by/instructorName?instructorName=${encodeURIComponent(instructorName)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },

  async searchProducts(name: string): Promise<ApiResponse<ProductDto[]>> {
    const response = await fetch(`${API_BASE_URL}/products/products/${name}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
}; 