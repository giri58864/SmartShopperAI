import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types/product';
import { useStore } from '../store/useStore';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">Brand: {product.brand}</p>
            <p className="text-sm text-gray-600">Category: {product.category}</p>
            <p className="text-sm text-gray-600">Rating: {product.rating}</p>
          </div>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{product.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-2">{product.description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold">${product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center space-x-1 bg-purple-600 text-white px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
        
        
      </div>
    </div>
  );
}