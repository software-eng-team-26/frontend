import { OrderStatus } from '../types/order';

const statusSteps = [
  OrderStatus.PROCESSING,
  OrderStatus.PROVISIONING,
  OrderStatus.DELIVERED
];

const statusLabels = {
  [OrderStatus.PENDING]: 'Order Created',
  [OrderStatus.PROCESSING]: 'Processing Access',
  [OrderStatus.PROVISIONING]: 'Provisioning Course',
  [OrderStatus.DELIVERED]: 'Course Delivered',
  [OrderStatus.CANCELLED]: 'Order Cancelled'
};

const statusIcons = {
  [OrderStatus.PENDING]: '📝',
  [OrderStatus.PROCESSING]: '💳',
  [OrderStatus.PROVISIONING]: '⚙️',
  [OrderStatus.DELIVERED]: '✅',
  [OrderStatus.CANCELLED]: '❌'
};

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  console.log('Raw status input:', {
    value: status,
    type: typeof status,
    validEnum: Object.values(OrderStatus).includes(status as OrderStatus)
  });

  // Ensure we have a valid status
  if (!status || !Object.values(OrderStatus).includes(status as OrderStatus)) {
    console.warn('Invalid status provided:', status);
    status = OrderStatus.PROCESSING; // Default to PROCESSING if invalid
  }

  const normalizedStatus = status as OrderStatus;
  
  console.log('Normalized status:', normalizedStatus);

  if (!normalizedStatus) {
    console.warn('No status provided to OrderStatusTracker');
    return null;
  }

  const getDisplayStep = (currentStatus: OrderStatus) => {
    switch (currentStatus) {
      case OrderStatus.PENDING:
      case OrderStatus.PROCESSING:
        return 0;
      case OrderStatus.PROVISIONING:
        return 1;
      case OrderStatus.DELIVERED:
        return 2;
      case OrderStatus.CANCELLED:
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getDisplayStep(normalizedStatus);

  if (normalizedStatus === OrderStatus.CANCELLED) {
    return (
      <div className="w-full py-4">
        <div className="flex justify-center">
          <div className="text-red-600">
            <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-red-600 bg-red-50">
              {statusIcons[OrderStatus.CANCELLED]}
            </div>
            <span className="text-sm mt-2 block text-center">
              {statusLabels[OrderStatus.CANCELLED]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="flex justify-between mb-2">
        {statusSteps.map((step, index) => (
          <div
            key={step}
            className={`flex flex-col items-center ${
              index <= currentStep ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 
              ${index <= currentStep ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}
            >
              {statusIcons[step]}
            </div>
            <span className="text-sm mt-2 text-center max-w-[100px]">
              {statusLabels[step]}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 transition-all duration-500" 
          style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
} 