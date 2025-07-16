'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { products as allProducts, Product } from '@/data/products/sync';
import { collections, getCollectionBySlug } from '@/data/collections';
import Footer from '@/components/Footer';
import { Header } from '@/components/Header';
import { ProductCardSimple } from '@/components/ProductCardSimple';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const filteredProducts = category
    ? allProducts.filter((p: Product) => {
        const collection = collections.find(c => c.slug === category);
        if (!collection) return false;
        
        // Special mapping for bottoms -> legwear
        if (collection.slug === 'bottoms') {
          return p.collection.toLowerCase() === 'legwear';
        }
        
        return p.collection.toLowerCase() === collection.name.toLowerCase();
      })
    : allProducts;
  
  // Get only collections that have products
  const collectionsWithProducts = collections.filter(collection => {
    if (collection.slug === 'frontpage' || collection.slug === 'coming-soon') {
      return false; // Skip these special collections
    }
    
    // Check if any product belongs to this collection
    return allProducts.some((p: Product) => {
      if (collection.slug === 'bottoms') {
        return p.collection.toLowerCase() === 'legwear';
      }
      return p.collection.toLowerCase() === collection.name.toLowerCase();
    });
  });

  const getCategoryDisplayName = (slug: string) => {
    const collection = getCollectionBySlug(slug);
    return collection ? collection.name : 'All Products';
  };

  return (
    <div className="bg-[#f0edec] min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-light text-black font-bodoni">
            {category ? getCategoryDisplayName(category) : 'All Products'}
          </h1>
          <p className="mt-4 text-lg text-gray-600 font-barlow-condensed max-w-2xl mx-auto">
            Discover our range of premium apparel, blending traditional motifs with modern streetwear aesthetics.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="flex justify-center flex-wrap gap-2">
            <Link
              href="/products"
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                !category ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {collectionsWithProducts.map((collection) => (
              <Link
                key={collection.slug}
                href={`/products?category=${collection.slug}`}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  category === collection.slug ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {collection.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product: Product, index: number) => (
            <ProductCardSimple
              key={product.slug}
              product={product}
              index={index}
              priority={index < 6}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No products found in this collection.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}