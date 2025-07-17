        'use client';
        import { useState, useMemo } from 'react';
        import { motion } from 'framer-motion';
        import ProductCard from '@/components/ProductCardSolidEdge';
        import Footer from '@/components/Footer';
        import { Product } from '@/data/products/types';

        interface LifestylePageClientProps {
          allProducts: Product[];
        }

        export default function LifestylePageClient({ allProducts }: LifestylePageClientProps) {
          const [filter, setFilter] = useState('All');

          const filteredProducts = useMemo(() => {
            if (filter === 'All') return allProducts;
            return allProducts.filter(p => p.collection === filter);
          }, [filter, allProducts]);

          const collections = useMemo(() => {
            const uniqueCollections = [...new Set(allProducts.map(p => p.collection))];
            return ['All', ...uniqueCollections];
          }, [allProducts]);

          return (
            <div className="bg-white text-black">
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Lifestyle</h1>
                  <p className="mt-4 text-lg leading-8 text-gray-600">Explore our products in real-life settings.</p>
                </div>

                <div className="mb-8 flex justify-center">
                  <div className="flex space-x-4">
                    {collections.map(collection => (
                      <button 
                        key={collection}
                        onClick={() => setFilter(collection)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          filter === collection ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}>
                        {collection}
                      </button>
                    ))}
                  </div>
                </div>

                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.slug} product={product} index={index} showLifestyleImage={true} cardHeight="h-[600px]" />
                  ))}
                </motion.div>
              </main>
              <Footer />
            </div>
          );
        }
