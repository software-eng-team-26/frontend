import { api } from '../api';
import { ApiResponse } from '../../types/api';

interface Discount {
  id: number;
  productId: number;
  discountRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface DiscountRequest {
  productId: number;
  discountRate: number;
  startDate: string;
  endDate: string;
}

export const discountApi = {
  getAllDiscounts: () => {
    return api.get<ApiResponse<Discount[]>>('/discounts/all');
  },

  createDiscount: (data: DiscountRequest) => {
    return api.post<ApiResponse<Discount>>('/discounts/create', data);
  },

  deactivateDiscount: (discountId: number) => {
    return api.post<ApiResponse<void>>(`/discounts/${discountId}/deactivate`);
  }
}; 