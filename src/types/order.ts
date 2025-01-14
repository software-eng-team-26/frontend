export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROVISIONING = 'PROVISIONING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum RefundStatus {
  NONE = 'NONE',
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  PENDING_RETURN = 'PENDING_RETURN',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  refundStatus: RefundStatus;
  product?: {
    id: number;
    originalPrice?: number;
  };
}

export interface Order {
  id: number;
  userId: number;
  userName: string;
  orderDate: string;
  orderStatus: OrderStatus;
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
