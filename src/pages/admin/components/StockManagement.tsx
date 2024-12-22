import { useEffect, useState } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { useStockManagementStore } from '../../../store/admin/useStockManagementStore';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';

export function StockManagement() {
  const { 
    products, 
    isLoading, 
    error,
    fetchProducts,
    updateStock
  } = useStockManagementStore();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Fetching products...');
        await fetchProducts();
        console.log('Products in component:', products);
      } catch (error) {
        console.error('Failed to load products:', error);
        toast.error('Failed to load products');
      }
    };
    
    loadProducts();
  }, [fetchProducts]);

  const handleStockUpdate = async (productId: number, newStock: number) => {
    try {
      await updateStock(productId, newStock);
      toast.success('Stock updated successfully');
    } catch (error: any) {
      console.error('Failed to update stock:', error);
      toast.error(error.message || 'Failed to update stock');
    }
  };

  const filteredProducts = (products || []).filter(product => {
    if (!product || !product.name) return false;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.id.toString().includes(searchQuery)
    );
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Stock Management</h1>

      {/* Debug info */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>Total Products: {products.length}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Current Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">#{product.id}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="h-10 w-10 rounded-full mr-3 object-cover"
                      />
                    )}
                    <div className="text-sm text-gray-900">{product.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">{product.category.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{product.inventory}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleStockUpdate(product.id, product.inventory - 1)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Decrease Stock"
                      disabled={product.inventory <= 0}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleStockUpdate(product.id, product.inventory + 1)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Increase Stock"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 