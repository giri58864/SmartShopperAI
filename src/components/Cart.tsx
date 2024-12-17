import React from 'react';
import { useStore } from '../store/useStore';
import { X, Trash2 } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
  const cart = useStore((state) => state.cart);
  const coupons = useStore((state) => state.coupons);
  const removeFromCart = useStore((state) => state.removeFromCart);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-xl">${total.toFixed(2)}</span>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold">Available Coupons:</h3>
            {coupons.length > 0 ? (
              <ul>
                {coupons.map((coupon, index) => (
                  <li key={index} className="text-gray-600">
                    {coupon.retailer}: {coupon.discount} (Code: {coupon.code})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No coupons available</p>
            )}
          </div>

          <button
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}