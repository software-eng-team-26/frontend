import { useState, useEffect } from 'react';
import { ProductFormData } from '../../../services/admin/productManagementApi';
import { useCategoryStore } from '../../../store/admin/useCategoryStore';

interface ProductFormProps {
  product?: any;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const { categories, fetchCategories } = useCategoryStore();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    brand: '',
    price: 0,
    inventory: 0,
    description: '',
    level: 1,
    duration: 0,
    moduleCount: 0,
    certification: false,
    instructorName: '',
    instructorRole: '',
    thumbnailUrl: '',
    curriculum: [''],
    category: {
      name: ''
    },
    featured: false,
    averageRating: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price || 0,
        inventory: product.inventory || 0,
        description: product.description || '',
        level: product.level || 1,
        duration: product.duration || 0,
        moduleCount: product.moduleCount || 0,
        certification: product.certification || false,
        instructorName: product.instructorName || '',
        instructorRole: product.instructorRole || '',
        thumbnailUrl: product.thumbnailUrl || '',
        curriculum: product.curriculum || [''],
        category: {
          name: product.category?.name || ''
        },
        featured: product.featured || false,
        averageRating: product.averageRating || 0
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleCurriculumChange = (index: number, value: string) => {
    const newCurriculum = [...formData.curriculum];
    newCurriculum[index] = value;
    setFormData(prev => ({ ...prev, curriculum: newCurriculum }));
  };

  const addCurriculumItem = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, '']
    }));
  };

  const removeCurriculumItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category.name"
            value={formData.category.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              category: { name: e.target.value }
            }))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              name="inventory"
              value={formData.inventory}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            type="url"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {/* Instructor Information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Instructor Name</label>
            <input
              type="text"
              name="instructorName"
              value={formData.instructorName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Instructor Role</label>
            <input
              type="text"
              name="instructorRole"
              value={formData.instructorRole}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value={1}>Beginner</option>
              <option value={2}>Intermediate</option>
              <option value={3}>Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (hours)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Module Count</label>
            <input
              type="number"
              name="moduleCount"
              value={formData.moduleCount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Curriculum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
          {formData.curriculum.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleCurriculumChange(index, e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                placeholder={`Module ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeCurriculumItem(index)}
                className="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCurriculumItem}
            className="text-indigo-600 hover:text-indigo-800 text-sm"
          >
            + Add Module
          </button>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {product ? 'Update' : 'Add'} Product
        </button>
      </div>
    </form>
  );
} 