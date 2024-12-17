import { create } from 'zustand';
import { Product } from '../types/product';
import { Coupon } from '../types/coupon';

interface StoreState {
  products: Product[];
  cart: Product[];
  chatbotResults: Product[];
  coupons: Coupon[];
  filters: {
    priceRange: [number, number];
    brands: string[];
    categories: string[];
    skinType: string[];
  };
  setProducts: (products: Product[]) => void;
  setChatbotResults: (products: Product[]) => void;
  setCoupons: (coupons: Coupon[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateFilters: (filters: Partial<StoreState['filters']>) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  cart: [],
  chatbotResults: [],
  coupons: [],
  filters: {
    priceRange: [0, 1000],
    brands: [],
    categories: [],
    skinType: [],
  },
  setProducts: (products) => set({ products }),
  setChatbotResults: (products) => set({ chatbotResults: products }),
  setCoupons: (coupons) => set({ coupons }),
  addToCart: (product) =>
    set((state) => ({ cart: [...state.cart, product] })),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  updateFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
}));