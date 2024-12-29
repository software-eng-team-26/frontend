import {api} from '../api';

// Kullanıcının bir sipariş için refund talebi göndermesi
export const createRefundRequest = async (orderId: number, orderItemIds: number[], token: string) => {
    try {
        const response = await api.post(
            `/orders/${orderId}/refund`,
            { orderItemIds },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating refund request:', error);
        throw error; // Hata durumunda üst bileşenlere iletir
    }
};
