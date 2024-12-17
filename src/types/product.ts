export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  rating: number;
  category: string;
  description: string;
  imageUrl: string;
  ingredients?: string[];
  skinType?: string[];
}