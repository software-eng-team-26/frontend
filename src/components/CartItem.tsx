import { CartItem as CartItemType } from '../services/cartApi';
import { useCartStore } from '../store/useCartStore';
import { Trash2, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const removeItem = useCartStore(state => state.removeItem);

  const handleRemove = async () => {
    try {
      await removeItem(item.product.id);
    } catch (error) {
      console.error('Error in CartItem:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-6">
        {item.product.imageUrl ? (
          <img 
            src={item.product.imageUrl} 
            alt={item.product.name} 
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Minus className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg text-gray-900 mb-1">{item.product.name}</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Price: <span className="font-medium text-gray-900">${item.product.price.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <p className="font-semibold text-lg text-gray-900">
                ${item.totalPrice.toFixed(2)}
              </p>
              <button
                onClick={handleRemove}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 -mt-1"
                title="Remove from cart"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 