import React, { useState } from 'react';
import { ShoppingCart, Menu as MenuIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Search } from './Search';
import { Cart } from './Cart';
import { Menu } from './Menu';

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cart = useStore((state) => state.cart);

  const handleProductSelect = (product: any) => {
    // Scroll to the product or highlight it
    const element = document.getElementById(`product-${product.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      element.classList.add('ring-2', 'ring-purple-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-purple-500');
      }, 2000);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button onClick={() => setIsMenuOpen(true)}>
                <MenuIcon className="h-6 w-6 mr-4 cursor-pointer" />
              </button>
              <span className="text-xl font-bold">Smart Shopper AI - Mumbai Marines</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Search onSelect={handleProductSelect} />
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-6 w-6 cursor-pointer" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}