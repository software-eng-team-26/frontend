import { useEffect, useState } from 'react';
import { Search, Plus, Edit, Trash2, XCircle } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { ProductForm } from './ProductForm';
import { useProductManagementStore } from '../../../store/admin/useProductManagementStore';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export function ProductManagement() {
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
    updateProduct
  } = useProductManagementStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* Search and Add Product */}
      <div className="flex justify-between mb-6">
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

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {/* Products Table */}
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={product.inventory}
                      onChange={async (e) => {
                        const newValue = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
                        if (!isNaN(newValue) && product.id) {
                          try {
                            await updateProduct(product.id, {
                              ...product,
                              inventory: newValue
                            });
                            await fetchProducts();
                            window.location.reload();
                          } catch (error) {
                            if (error.response?.status === 500 && 
                                error.response?.data?.includes('JWT expired')) {
                              await fetchProducts();
                              window.location.reload();
                            } else {
                              console.error('Error updating stock:', error);
                            }
                          }
                        }
                      }}
                      className={`w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        product.inventory <= 10 ? 'text-red-600 font-medium' : 'text-gray-900'
                      }`}
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{product.instructorName}</div>
                  <div className="text-sm text-gray-500">{product.instructorRole}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Product"
      >
        <ProductForm
          onSubmit={async (data) => {
            try {
              await addProduct(data);
              await fetchProducts();
              setShowAddModal(false);
              window.location.reload();
            } catch (error) {
              if (error.response?.status === 500 && 
                  error.response?.data?.includes('JWT expired')) {
                await fetchProducts();
                setShowAddModal(false);
                window.location.reload();
              } else {
                console.error('Error adding product:', error);
              }
            }
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
              try {
                await updateProduct(selectedProduct.id, data);
                await fetchProducts();
                setShowEditModal(false);
                clearSelectedProduct();
                window.location.reload();
              } catch (error) {
                if (error.response?.status === 500 && 
                    error.response?.data?.includes('JWT expired')) {
                  await fetchProducts();
                  setShowEditModal(false);
                  clearSelectedProduct();
                  window.location.reload();
                } else {
                  console.error('Error updating product:', error);
                }
              }
            }
          }}
          onCancel={() => {
            setShowEditModal(false);
            clearSelectedProduct();
          }}
        />
      </Modal>
    </div>
  );
} 