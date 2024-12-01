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