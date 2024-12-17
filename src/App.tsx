import React from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { Chatbot } from './components/Chatbot';
import { useStore } from './store/useStore';
import { useInitializeData } from './hooks/useInitializeData';

function App() {
  const products = useStore((state) => state.products);
  const chatbotResults = useStore((state) => state.chatbotResults);
  const filters = useStore((state) => state.filters);
  useInitializeData();

  const filteredProducts = chatbotResults.length > 0 ? chatbotResults : products.filter(product => {
    const matchesPrice = product.price >= filters.priceRange[0] && 
                        product.price <= filters.priceRange[1];
    const matchesBrand = filters.brands.length === 0 || 
                        filters.brands.includes(product.brand);
    const matchesCategory = filters.categories.length === 0 || 
                          filters.categories.includes(product.category);
    const matchesSkinType = filters.skinType.length === 0 || 
                          (product.skinType && 
                           product.skinType.some(type => filters.skinType.includes(type)));

    return matchesPrice && matchesBrand && matchesCategory && matchesSkinType;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {chatbotResults.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">
              Recommended Products
            </h2>
            <p className="text-gray-600">
              Based on your conversation with our Smart Shopper AI assistant
            </p>
          </div>
        )}

        {products.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No products match your criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} id={`product-${product.id}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </main>

      <Chatbot />
    </div>
  );
}

export default App;