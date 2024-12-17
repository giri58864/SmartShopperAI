import { Product } from '../types/product';

export async function fetchProducts(): Promise<Product[]> {
  // In a real application, this would fetch from an API
  // For now, we'll import sample data
  const { sampleProducts } = await import('../data/sampleData');
  return sampleProducts;
}