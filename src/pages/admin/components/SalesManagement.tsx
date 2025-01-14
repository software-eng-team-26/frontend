import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, XCircle, DollarSign, Percent } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { ProductForm } from './ProductForm';
import { useProductManagementStore } from '../../../store/admin/useProductManagementStore';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { discountApi } from '../../../services/admin/discountApi';
import { RefundManagement } from './RefundManagement';

interface DiscountForm {
  productId: number;
  discountRate: number;
}

export function SalesManagement() {
  const { 
    products, 
    isLoading, 
    error,
    fetchProducts,
    deleteProduct,
    selectedProduct,
    setSelectedProduct,
    clearSelectedProduct,
    addProduct,
    updateProduct,
    updateProductStock,
    updateProductPrice
  } = useProductManagementStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState<{[key: number]: string}>({});
  const [editingDiscount, setEditingDiscount] = useState<{[key: number]: string}>({});
  const [activeTab, setActiveTab] = useState<'sales' | 'refunds'>('sales');

  useEffect(() => {
    console.log('Active tab:', activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this product? This action cannot be undone. ' +
      'Note: Make sure the product is not associated with any active categories.'
    );

    if (confirmDelete) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        // Error handling is done in the store
      }
    }
  };

  const handlePriceUpdate = async (productId: number, newPrice: string) => {
    try {
      const price = parseFloat(newPrice);
      if (isNaN(price) || price < 0) {
        toast.error('Please enter a valid price');
        return;
      }

      await updateProductPrice(productId, price);
      
      setEditingPrice(prev => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
      toast.success('Price updated successfully');
    } catch (error: any) {
      console.error('Failed to update price:', error);
      toast.error(error.message || 'Failed to update price');
    }
  };

  const handleDiscountUpdate = async (productId: number, discountRate: string) => {
    try {
      const rate = parseFloat(discountRate);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        toast.error('Please enter a valid discount rate between 0 and 100');
        return;
      }

      const discountForm = {
        productId: productId,
        discountRate: rate
      };

      console.log('Sending discount data:', discountForm);

      const response = await discountApi.createDiscount(discountForm);
      
      if (response.status === 200) {
        await fetchProducts(); // Refresh products to show updated prices
        setEditingDiscount(prev => {
          const newState = { ...prev };
          delete newState[productId];
          return newState;
        });
        toast.success('Discount applied successfully');
      }
    } catch (error: any) {
      console.error('Failed to apply discount:', error);
      const errorMessage = error.response?.data?.message || 'Failed to apply discount';
      toast.error(errorMessage);
    }
  };

  const filteredProducts = products.filter(product => 
    (product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
    (product.category?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
              {error.includes('foreign key constraint') && (
                <p className="mt-1">
                  Tip: Remove the category association before deleting the product.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                console.log('Switching to sales tab');
                setActiveTab('sales');
              }}
              className={`${
                activeTab === 'sales'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Sales
            </button>
            <button
              onClick={() => {
                console.log('Switching to refunds tab');
                setActiveTab('refunds');
              }}
              className={`${
                activeTab === 'refunds'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Refunds
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'sales' ? (
        <div>
          <h1 className="text-2xl font-bold mb-6">Sales Management</h1>

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

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Discount
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
                      <div className="flex items-center">
                        <img 
                          src={product.thumbnailUrl} 
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{product.category?.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">${product.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${
                        product.inventory <= 10 ? 'text-red-600 font-medium' : 'text-gray-900'
                      }`}>
                        {product.inventory}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{product.instructorName}</div>
                      <div className="text-sm text-gray-500">{product.instructorRole}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingDiscount[product.id] !== undefined ? (
                        <div className="flex items-center justify-end space-x-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={editingDiscount[product.id]}
                            onChange={(e) => setEditingDiscount(prev => ({
                              ...prev,
                              [product.id]: e.target.value
                            }))}
                            className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0-100%"
                          />
                          <span className="text-sm text-gray-500">%</span>
                          <button
                            onClick={() => handleDiscountUpdate(product.id, editingDiscount[product.id])}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDiscount(prev => {
                              const newState = { ...prev };
                              delete newState[product.id];
                              return newState;
                            })}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end">
                          {product.isOnSale ? (
                            <div className="flex items-center">
                              <span className="text-sm text-green-600 mr-2">{product.discountRate}% off</span>
                              <button
                                onClick={() => setEditingDiscount(prev => ({
                                  ...prev,
                                  [product.id]: product.discountRate?.toString() || '0'
                                }))}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <Percent className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingDiscount(prev => ({
                                ...prev,
                                [product.id]: '0'
                              }))}
                              className="text-blue-600 hover:text-blue-900 flex items-center"
                            >
                              <Percent className="w-4 h-4 mr-1" />
                              Add Discount
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingPrice[product.id] !== undefined ? (
                        <div className="flex items-center justify-end space-x-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingPrice[product.id]}
                            onChange={(e) => setEditingPrice(prev => ({
                              ...prev,
                              [product.id]: e.target.value
                            }))}
                            className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="New price"
                          />
                          <button
                            onClick={() => handlePriceUpdate(product.id, editingPrice[product.id])}
                            className="text-green-600 hover:text-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPrice(prev => {
                              const newState = { ...prev };
                              delete newState[product.id];
                              return newState;
                            })}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingPrice(prev => ({
                            ...prev,
                            [product.id]: product.price.toString()
                          }))}
                          className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                        >
                          <DollarSign className="w-4 h-4 mr-1" />
                          Edit Price
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Add New Product"
          >
            <ProductForm
              onSubmit={async (data) => {
                await addProduct(data);
                setShowAddModal(false);
              }}
              onCancel={() => setShowAddModal(false)}
            />
          </Modal>

          <Modal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              clearSelectedProduct();
            }}
            title="Edit Product"
          >
            <ProductForm
              product={selectedProduct}
              onSubmit={async (data) => {
                if (selectedProduct?.id) {
                  await updateProduct(selectedProduct.id, data);
                  setShowEditModal(false);
                  clearSelectedProduct();
                }
              }}
              onCancel={() => {
                setShowEditModal(false);
                clearSelectedProduct();
              }}
            />
          </Modal>
        </div>
      ) : (
        <div>
          <h1>Refund Management</h1>
          <RefundManagement />
        </div>
      )}
    </div>
  );
} 