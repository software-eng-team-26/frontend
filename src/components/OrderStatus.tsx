import { OrderStatus } from '../types/order';

const statusSteps = [
  OrderStatus.PENDING,
  OrderStatus.PROCESSING,
  OrderStatus.PROVISIONING,
  OrderStatus.DELIVERED
];

const statusLabels = {
  [OrderStatus.PENDING]: 'Order Created',
  [OrderStatus.PROCESSING]: 'Processing Access',
  [OrderStatus.PROVISIONING]: 'Course Granted',
  [OrderStatus.DELIVERED]: 'Welcome Package Delivered'
};

const statusIcons = {
  [OrderStatus.PENDING]: '📝',
  [OrderStatus.PROCESSING]: '💳',
  [OrderStatus.PROVISIONING]: '⚙️',
  [OrderStatus.DELIVERED]: '✅'
};

export function OrderStatusTracker({ status }: { status: OrderStatus }) {
  const currentStep = statusSteps.indexOf(status);

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