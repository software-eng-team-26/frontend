interface ProductDetails {
  model: string;
  serialNumber: string;
  warrantyStatus: boolean;
  distributor: {
    name: string;
    contact: string;
    address: string;
  };
}

export interface ProductDto {
  id: number;
  name: string;
  price: number;
  description: string;
  thumbnail: string;
  inventory: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  inventory: number;
  category: {
    id: number;
    name: string;
  };
  imageUrl?: string;
  isOnSale?: boolean;
  discountRate?: number;
  originalPrice?: number;
  saleStartDate?: string;
  saleEndDate?: string;
} 