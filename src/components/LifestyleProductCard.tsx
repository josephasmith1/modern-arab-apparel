'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useColorExtractor } from '@/hooks/useColorExtractor';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Product, ProductColor } from '@/data/products/types';

interface LifestyleProductCardProps {
  product: Product;
  colorVariant: ProductColor;
  colorIndex: number;
  index: number;
}

export default function LifestyleProductCard({ 
  product, 
  colorVariant, 
  colorIndex, 
  index 
}: LifestyleProductCardProps) {
  const [bgColor, setBgColor] = useState('#f5f5f4'); // Default beige
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { extractBackgroundColor } = useColorExtractor();
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
    triggerOnce: true
  });

  // Get the first lifestyle image or fallback to main image
  const displayImage = colorVariant.images.lifestyle[currentImageIndex] || colorVariant.images.main;

  useEffect(() => {
    // Only extract background color when visible
    if (isIntersecting && displayImage) {
      extractBackgroundColor(displayImage, (extractedBgColor: string) => {
        setBgColor(extractedBgColor);
      });
    }
  }, [displayImage, extractBackgroundColor, isIntersecting]);

  // Cycle through lifestyle images on hover
  const handleMouseEnter = () => {
    if (colorVariant.images.lifestyle.length > 1) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % colorVariant.images.lifestyle.length
      );
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <motion.div 
      ref={targetRef}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/products/${product.slug}?color=${colorIndex}`}>
        <div 
          className="relative h-96 overflow-hidden transition-colors duration-700"
          style={{ backgroundColor: bgColor }}
        >
          <Image
            src={displayImage}
            alt={`${product.name} - ${colorVariant.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 relative z-10"
            priority={index < 6}
            loading={index < 6 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-20"></div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
            {product.name}
          </h3>
          <div className="flex items-center mt-2 mb-2">
            <div className="flex items-center space-x-2">
              <div
                className="relative w-5 h-5 rounded-full border border-gray-300"
                title={colorVariant.name}
              >
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: colorVariant.hex }}
                />
              </div>
              <span className="text-sm text-gray-600 font-barlow-condensed">
                {colorVariant.name}
              </span>
            </div>
          </div>
          <p className="text-gray-600 mb-4 text-sm line-clamp-3 font-barlow-condensed">
            {product.description.replace(/<[^>]*>/g, '').substring(0, 120)}...
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-black font-barlow-condensed">{product.price}</span>
              {(product.originalPrice && product.originalPrice !== product.price) && (
                <span className="text-lg text-gray-500 line-through font-barlow-condensed">{product.originalPrice}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}