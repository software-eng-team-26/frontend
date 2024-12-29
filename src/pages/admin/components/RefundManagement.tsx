import React, { useEffect, useState } from 'react';
import { fetchRefundRequests, updateRefundStatus } from '../../../services/admin/refundManagementApi';


interface RefundRequest {
    id: number;
    orderId: number;
    productName: string;
    quantity: number;
    refundAmount: number;
    status: string;
}

const RefundManagementPage = () => {
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const data = await fetchRefundRequests();
                setRefundRequests(data);
            } catch (error) {
                console.error('Error fetching refund requests:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleUpdateStatus = async (requestId: number, status: string) => {
        try {
            await updateRefundStatus(requestId, status);
            alert(`Refund request ${status} successfully.`);
            setRefundRequests((prevRequests) =>
                prevRequests.map((request) =>
                    request.id === requestId ? { ...request, status } : request
                )
            );
        } catch (error) {
            console.error(`Error updating refund request status:`, error);
            alert(`Failed to update refund request.`);
        }
    };

    if (loading) {
        return <p>Loading refund requests...</p>;
    }

    return (
        <div>
            <h1>Refund Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Refund Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {refundRequests.map((request) => (
                        <tr key={request.id}>
                            <td>{request.orderId}</td>
                            <td>{request.productName}</td>
                            <td>{request.quantity}</td>
                            <td>{request.refundAmount.toFixed(2)}</td>
                            <td>{request.status}</td>
                            <td>
                                {request.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus(request.id, 'APPROVED')
                                            }
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus(request.id, 'REJECTED')
                                            }
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RefundManagementPage;
