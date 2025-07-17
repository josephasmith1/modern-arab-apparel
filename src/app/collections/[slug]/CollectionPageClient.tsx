'use client';

import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ProductCardSolidEdge from '@/components/ProductCardSolidEdge';
import { Product } from '@/data/products/types';

interface CollectionPageClientProps {
  collection: {
    slug: string;
    name: string;
    description: string;
    image: string;
  };
  collectionProducts: Product[];
}

export default function CollectionPageClient({ collection, collectionProducts }: CollectionPageClientProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-[1920px] mx-auto">
        {/* Breadcrumb Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 py-4"
        >
          <ol className="flex items-center space-x-2 text-sm font-barlow-condensed">
            <li>
              <Link href="/" className="text-gray-500 hover:text-black transition-colors">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/collections" className="text-gray-500 hover:text-black transition-colors">
                Collections
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-black font-medium">
              {collection.name}
            </li>
          </ol>
        </motion.nav>

        {/* Hero Section - 2 Column Layout */}
        <div ref={heroRef} className="relative h-[90vh] overflow-hidden" style={{ position: 'relative' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Column - Full Height Image with Parallax */}
            <motion.div 
              className="relative h-full overflow-hidden"
              style={{ y }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ scale }}
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-contain object-center"
                  style={{ backgroundColor: '#f0edec' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
              </motion.div>
              
              {/* Parallax Collection Name Overlay */}
              <motion.div 
                className="absolute inset-0 flex items-end justify-start p-8 lg:p-16"
                style={{ opacity }}
              >
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-6xl md:text-8xl lg:text-9xl font-bold text-black font-bodoni"
                >
                  {collection.name}
                </motion.h1>
              </motion.div>
            </motion.div>

            {/* Right Column - Description */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center px-8 lg:px-16 py-12 lg:py-0 bg-white lg:bg-transparent"
            >
              <div className="max-w-lg">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-4xl md:text-5xl font-light mb-6 text-black font-bodoni"
                >
                  {collection.name}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-lg md:text-xl text-gray-700 font-barlow-condensed leading-relaxed mb-8"
                >
                  {collection.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  <Link 
                    href="#products"
                    className="inline-flex items-center text-black border-b-2 border-black hover:border-gray-600 hover:text-gray-600 transition-colors font-barlow-condensed font-semibold"
                  >
                    <span className="mr-2">Explore Collection</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Products Grid */}
        <div id="products" className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {collectionProducts.length > 0 ? (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
              {collectionProducts.map((product, index) => (
                <ProductCardSolidEdge 
                  key={product.slug}
                  product={product}
                  index={index}
                />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-xl p-8 text-center"
              >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-light mb-6 text-black font-bodoni">
                  Products Coming Soon
                </h3>
                <p className="text-xl text-gray-700 mb-8 font-barlow-condensed">
                  We&apos;re currently updating our product catalog for this collection. 
                  Check back soon to see all the amazing products we have in store!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href="/collections"
                    className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Browse All Collections
                  </Link>
                  <Link 
                    href="/products"
                    className="bg-white text-black border-2 border-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors"
                  >
                    View All Products
                  </Link>
                </div>
              </div>
            </motion.div>
            )}

            {/* Related Collections */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-20"
            >
            <h3 className="text-3xl font-light mb-8 text-black font-bodoni text-center">
              Explore More Collections
            </h3>
            <div className="text-center">
              <Link 
                href="/collections"
                className="inline-flex items-center text-black hover:text-gray-700 transition-colors font-barlow-condensed"
              >
                <span className="text-lg font-medium mr-2">View All Collections</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}