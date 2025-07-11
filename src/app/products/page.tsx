'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { products as allProducts, Product } from './data';
import { collections, getCollectionBySlug } from '@/data/collections';
import Footer from '@/components/Footer';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  const filteredProducts = category
    ? allProducts.filter((p: Product) => p.collection === category)
    : allProducts;

  const getCategoryDisplayName = (slug: string) => {
    const collection = getCollectionBySlug(slug);
    return collection ? collection.name : 'All Products';
  };

  return (
    <div className="bg-[#f0edec] min-h-screen">
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
            {collections.map((collection) => (
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
          {filteredProducts.map((product: Product) => (
            <motion.div
              key={product.slug}
              className="group bg-white rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={product.colors[0].images.main}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.tags.includes('New Arrival') && (
                    <div className="absolute top-4 left-4 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                      NEW
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-light text-black font-bodoni mb-2 truncate">{product.name}</h3>
                  <p className="text-gray-600 font-barlow-condensed">{product.price}</p>
                </div>
              </Link>
            </motion.div>
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