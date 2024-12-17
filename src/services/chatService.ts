import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY, CHATBOT_SYSTEM_PROMPT } from '../config/constants';
import { FilterService } from './filterService';
import { useStore } from '../store/useStore';
import { Coupon } from '../types/coupon';
import { Product } from '../types/product';

export class ChatService {
  private static instance: ChatService;
  private model: any;
  private context: string[] = [];

  private constructor() {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private formatProductSuggestions(products: Product[]): string {
    if (products.length === 0) return "I couldn't find any products matching your criteria.";
    
    const categories = products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    return Object.entries(categories)
      .map(([category, items]) => {
        const productList = items
          .slice(0, 3) // Limit to 3 products per category
          .map(product => `- **${product.name}** by ${product.brand} - $${product.price}\n  *${product.description}*`)
          .join('\n');
        return `### ${category}\n${productList}`;
      })
      .join('\n\n');
  }

  private formatCouponSuggestions(coupons: Coupon[], recommendedProducts: Product[]): string {
    if (coupons.length === 0) return "No available coupons at the moment.";
    
    // Filter coupons based on recommended products
    const relevantCoupons = coupons.filter(coupon => 
      recommendedProducts.some(product => product.id === coupon.productId)
    );

    if (relevantCoupons.length === 0) return "No relevant coupons for the recommended products.";

    return relevantCoupons
      .map(coupon => `- **${coupon.retailer}**: ${coupon.discount} (Code: ${coupon.code})`)
      .join('\n');
  }

  public async generateResponse(userMessage: string): Promise<string> {
    try {
      // Extract filters from user message
      const extractedFilters = FilterService.extractFiltersFromText(userMessage);
      
      // Get products and coupons from store
      const products = useStore.getState().products;
      const coupons = useStore.getState().coupons;
      
      // Filter products based on extracted criteria
      const filteredProducts = FilterService.filterProducts(products, extractedFilters);
      
      // Update store with filtered products
      useStore.getState().setChatbotResults(filteredProducts);
      
      // Add context about available products
      const productContext = this.formatProductSuggestions(filteredProducts);
      
      // Add context about available coupons
      const couponContext = this.formatCouponSuggestions(coupons, filteredProducts);
      
      // Build complete prompt with product details
      // const productDetails = filteredProducts.map(product => {
      //   return `- **${product.name}** by ${product.brand} - $${product.price} (Rating: ${product.rating})\n  *${product.description}*`;
      // }).join('\n');

      const prompt = `${CHATBOT_SYSTEM_PROMPT}

Previous context: ${this.context.join('\n')}

User: ${userMessage}

You are a cosmetic chatbot named Smart Shopper AI Assistant, you help users with above provided cosmetic products related recomendations and suggestions.
Answer politely for all the user requests.
If the user is greeting then respond politely and also appropriately greet back else if asked about something else
then, provide a brief introduction about the product recommendations before listing them. 

### Product Recommendations
${productContext}

### Available Coupons
${couponContext}

Provide a helpful response that includes:
1. Specific product recommendations from the available products list, along with:
   - Reasons for each recommendation.
   - User ratings for each product.
2. Relevant coupons that may help the user, along with their discounts.
3. If no products match exactly, ask for clarification.

Format the response using bullet points for better readability wherever felt required.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      // Update context
      this.context = [...this.context.slice(-2), userMessage, response.text()];
      
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response');
    }
  }
}