import React from 'react';

interface SortingProps {
  onSortChange: (sortOption: 'lowToHigh' | 'highToLow') => void; // Fiyat sıralaması değişikliği
  selectedSort: string; // Şu anda seçili olan sıralama türü
}

const SortingComponent: React.FC<SortingProps> = ({ onSortChange, selectedSort }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <label htmlFor="sorting" className="text-gray-700 font-medium">
        Sort by:
      </label>
      <select
        id="sorting"
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value as 'lowToHigh' | 'highToLow')}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>
    </div>
  );
};

export default SortingComponent;
