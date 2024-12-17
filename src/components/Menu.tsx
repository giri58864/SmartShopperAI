import React from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const filters = useStore((state) => state.filters);
  const updateFilters = useStore((state) => state.updateFilters);
  const products = useStore((state) => state.products);

  const brands = Array.from(new Set(products.map(p => p.brand)));
  const categories = Array.from(new Set(products.map(p => p.category)));
  const skinTypes = Array.from(new Set(products.flatMap(p => p.skinType || [])));

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Price Range</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilters({ priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                className="w-24 px-2 py-1 border rounded"
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilters({ priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                className="w-24 px-2 py-1 border rounded"
                min="0"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Brands</h3>
            {brands.map(brand => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={(e) => {
                    const newBrands = e.target.checked
                      ? [...filters.brands, brand]
                      : filters.brands.filter(b => b !== brand);
                    updateFilters({ brands: newBrands });
                  }}
                  className="rounded text-purple-600"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            {categories.map(category => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={(e) => {
                    const newCategories = e.target.checked
                      ? [...filters.categories, category]
                      : filters.categories.filter(c => c !== category);
                    updateFilters({ categories: newCategories });
                  }}
                  className="rounded text-purple-600"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-2">Skin Type</h3>
            {skinTypes.map(type => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.skinType.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.skinType, type]
                      : filters.skinType.filter(t => t !== type);
                    updateFilters({ skinType: newTypes });
                  }}
                  className="rounded text-purple-600"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}