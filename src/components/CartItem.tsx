import { CartItem as CartItemType } from '../services/cartApi';
import { useCartStore } from '../store/useCartStore';
import { Trash2 } from 'lucide-react';
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
    <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {item.product.imageUrl && (
          <img 
            src={item.product.imageUrl} 
            alt={item.product.name} 
            className="w-16 h-16 object-cover rounded"
          />
        )}
        <div>
          <h3 className="font-medium text-gray-900">{item.product.name}</h3>
          <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <p className="font-medium text-gray-900">
          ${item.totalPrice.toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 