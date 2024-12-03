export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROVISIONING = 'PROVISIONING',
  DELIVERED = 'DELIVERED'
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  items: Array<{
    id: number;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
