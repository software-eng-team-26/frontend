import { useEffect, useState } from 'react';
import { Search, Plus, Percent } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { discountApi } from '../../../services/admin/discountApi';
import { format } from 'date-fns';
import { Product } from '../../../types/product';
import { useProductManagementStore } from '../../../store/admin/useProductManagementStore';

interface Discount {
  id: number;
  productId: number;
  discountRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface DiscountForm {
  productId: number;
  discountRate: number;
  startDate: string;
  endDate: string;
}

export function DiscountManagement() {
  const { products, fetchProducts } = useProductManagementStore();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [discountForm, setDiscountForm] = useState<DiscountForm>({
    productId: 0,
    discountRate: 0,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setIsLoading(true);
      const response = await discountApi.getAllDiscounts();
      setDiscounts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch discounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDiscount = async () => {
    try {
      if (!discountForm.productId) {
        toast.error('Please select a product');
        return;
      }
      if (discountForm.discountRate <= 0 || discountForm.discountRate > 100) {
        toast.error('Please enter a valid discount rate between 0 and 100');
        return;
      }
      if (!discountForm.startDate || !discountForm.endDate) {
        toast.error('Please select start and end dates');
        return;
      }

      await discountApi.createDiscount(discountForm);
      toast.success('Discount created successfully');
      setShowAddModal(false);
      setDiscountForm({
        productId: 0,
        discountRate: 0,
        startDate: '',
        endDate: ''
      });
      fetchDiscounts();
    } catch (error) {
      toast.error('Failed to create discount');
    }
  };

  const handleDeactivateDiscount = async (discountId: number) => {
    try {
      await discountApi.deactivateDiscount(discountId);
      toast.success('Discount deactivated successfully');
      fetchDiscounts();
    } catch (error) {
      toast.error('Failed to deactivate discount');
    }
  };

  const filteredDiscounts = discounts.filter(discount => {
    const product = products.find(p => p.id === discount.productId);
    if (!product) return false;

    const searchLower = searchQuery.toLowerCase();
    return product.name.toLowerCase().includes(searchLower);
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Discount Management</h1>

      {/* Search and Add */}
      <div className="flex justify-between mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search discounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Discount
        </button>
      </div>

      {/* Discounts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Discount Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Start Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDiscounts.map((discount) => {
              const product = products.find(p => p.id === discount.productId);
              if (!product) return null;

              return (
                <tr key={discount.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{discount.discountRate}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {format(new Date(discount.startDate), 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">
                      {format(new Date(discount.endDate), 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${discount.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {discount.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {discount.isActive && (
                      <button
                        onClick={() => handleDeactivateDiscount(discount.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Discount Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Discount"
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product
            </label>
            <select
              value={discountForm.productId}
              onChange={(e) => setDiscountForm(prev => ({ ...prev, productId: Number(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Select a product</option>
              {products.map(product => (
                <option 
                  key={product.id} 
                  value={product.id}
                  disabled={product.isOnSale}
                  className="py-2"
                >
                  {product.title} - ${product.price.toFixed(2)}
                  {product.isOnSale && ' (Already on sale)'}
                </option>
              ))}
            </select>
          </div>

          {/* Show more detailed product info when selected */}
          {discountForm.productId > 0 && (
            <div className="mb-4 mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <img 
                  src={products.find(p => p.id === discountForm.productId)?.thumbnailUrl} 
                  alt="Product"
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {products.find(p => p.id === discountForm.productId)?.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {products.find(p => p.id === discountForm.productId)?.category?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Price: ${products.find(p => p.id === discountForm.productId)?.price}
                  </p>
                  {discountForm.discountRate > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                      New Price: ${calculateDiscountedPrice(
                        products.find(p => p.id === discountForm.productId)?.price || 0,
                        discountForm.discountRate
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Rate (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={discountForm.discountRate}
              onChange={(e) => setDiscountForm(prev => ({ ...prev, discountRate: Number(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={discountForm.startDate}
              onChange={(e) => setDiscountForm(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={discountForm.endDate}
              onChange={(e) => setDiscountForm(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateDiscount}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Discount
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function calculateDiscountedPrice(originalPrice: number, discountRate: number): string {
  const discountedPrice = originalPrice * (1 - discountRate / 100);
  return discountedPrice.toFixed(2);
} 