export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  shippingEmail: string | null;
  shippingPhone: string | null;
  items: OrderItem[];
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

export interface OrderItem{

  id: number;
  productName: string;
  quantity: number;
  price: number;


}