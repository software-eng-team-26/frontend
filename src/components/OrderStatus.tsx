import { OrderStatus } from '../types/order';

const statusSteps = [
  OrderStatus.PENDING,
  OrderStatus.PAID,
  OrderStatus.PROCESSING,
  OrderStatus.IN_TRANSIT,
  OrderStatus.DELIVERED
];

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
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${index <= currentStep ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'}`}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <span className="text-sm mt-1">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 