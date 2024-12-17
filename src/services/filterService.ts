import { Product } from '../types/product';

interface ExtractedFilters {
  priceRange?: [number, number];
  brands?: string[];
  categories?: string[];
  skinType?: string[];
  keywords?: string[];
}

export class FilterService {
  static extractFiltersFromText(text: string): ExtractedFilters {
    const filters: ExtractedFilters = {};
    
    // Extract price range
    const priceMatch = text.match(/\$(\d+)(?:\s*-\s*\$?(\d+))?/);
    if (priceMatch) {
      const min = parseInt(priceMatch[1]);
      const max = priceMatch[2] ? parseInt(priceMatch[2]) : min + 50;
      filters.priceRange = [min, max];
    }

    // Extract skin types
    const skinTypes = ['dry', 'oily', 'combination', 'sensitive', 'normal', 'all'];
    filters.skinType = skinTypes.filter(type => 
      text.toLowerCase().includes(type)
    );

    // Extract categories
    const categories = ['skincare', 'makeup', 'cleanser', 'moisturizer', 'serum'];
    filters.categories = categories.filter(category => 
      text.toLowerCase().includes(category)
    );

    // Extract keywords for general matching
    filters.keywords = text
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 3);

    return filters;
  }

  static filterProducts(products: Product[], filters: ExtractedFilters): Product[] {
    return products.filter(product => {
      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (product.price < min || product.price > max) return false;
      }

      // Skin type filter
      if (filters.skinType?.length) {
        if (!product.skinType?.some(type => 
          filters.skinType!.includes(type.toLowerCase())
        )) return false;
      }

      // Category filter
      if (filters.categories?.length) {
        if (!filters.categories.some(category => 
          product.category.toLowerCase().includes(category)
        )) return false;
      }

      // Keyword matching
      if (filters.keywords?.length) {
        const productText = `${product.name} ${product.description} ${product.brand}`.toLowerCase();
        return filters.keywords.some(keyword => productText.includes(keyword));
      }

      return true;
    });
  }
}