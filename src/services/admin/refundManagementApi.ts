import {api} from '../api'; // API yapılandırması için kullanılan ana dosyayı içe aktarın.

/**
 * Tüm refund taleplerini getiren fonksiyon.
 */
export const fetchRefundRequests = async () => {
    const response = await api.get('/admin/refunds'); // Backend'den refund taleplerini getir.
    return response.data; // Response içindeki datayı döndür.
};

/**
 * Belirli bir refund talebinin durumunu güncelleyen fonksiyon.
 * 
 * @param refundId Refund talebinin ID'si.
 * @param status Yeni durum ("APPROVED", "REJECTED", vb.).
 */
export const updateRefundStatus = async (refundId: number, status: string) => {
    const response = await api.put(`/admin/refunds/${refundId}`, { status }); // Refund durumu güncelleme isteği gönder.
    return response.data; // Response içindeki datayı döndür.
};

// Fonksiyonları export edin.

