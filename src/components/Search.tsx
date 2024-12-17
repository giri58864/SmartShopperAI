import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Product } from '../types/product';

interface SearchProps {
  onSelect: (product: Product) => void;
}

export function Search({ onSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const products = useStore((state) => state.products);

  useEffect(() => {
    if (query.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, products]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-8 top-2.5"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
        <SearchIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto z-50">
          {results.map(product => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <div>
                <div className="font-semibold">{product.name}</div>
                <div className="text-sm text-gray-600">{product.brand}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}