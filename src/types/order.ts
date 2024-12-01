export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED'
}

export interface Order {
  orderId: number;
  orderDate: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  shippingAddress: string;
  shippingEmail: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: ProductDto;
  quantity: number;
  price: number;
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
