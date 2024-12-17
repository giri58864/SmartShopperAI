import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchProducts } from '../services/dataService';
import { CouponService } from '../services/couponService';
import { sampleCoupons } from '../data/sampleCoupons';

export function useInitializeData() {
  const setProducts = useStore((state) => state.setProducts);
  const setCoupons = useStore((state) => state.setCoupons);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);

        setCoupons(sampleCoupons);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [setProducts, setCoupons]);
}