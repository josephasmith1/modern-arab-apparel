'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useColorExtractor } from '@/hooks/useColorExtractor';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Product, ProductColor as Color } from '@/data/products/types';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCardSimple({ product, index }: ProductCardProps) {
  const [bgColor, setBgColor] = useState('#f5f5f4'); // Default beige
  const { extractBackgroundColor } = useColorExtractor();
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '200px',
    triggerOnce: true
  });

  useEffect(() => {
    // Only extract background color when visible
    if (isIntersecting && product.colors && product.colors.length > 0 && product.colors[0]?.images?.main) {
      extractBackgroundColor(product.colors[0].images.main, (extractedBgColor: string) => {
        setBgColor(extractedBgColor);
      });
    }
  }, [product, extractBackgroundColor, isIntersecting]);

  return (
    <motion.div 
      ref={targetRef}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
    >
      <Link href={`/products/${product.slug}`}>
        <div 
          className="relative h-96 overflow-hidden transition-colors duration-700"
          style={{ backgroundColor: bgColor }}
        >
          <Image
            src={product.colors[0]?.images?.main || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center group-hover:scale-105 transition-transform duration-500 relative z-10"
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
            <div className="flex space-x-2">
              {(() => {
                // Filter out duplicate colors by hex value
                const uniqueColors = product.colors.filter((color: Color, index: number, self: Color[]) => 
                  self.findIndex(c => c.hex === color.hex) === index
                );
                
                return uniqueColors.length === 1 ? (
                  <span className="text-sm text-gray-600 font-barlow-condensed">
                    {uniqueColors[0].name}
                  </span>
                ) : (
                  <>
                    {uniqueColors.slice(0, 5).map((color: Color) => (
                      <div
                        key={color.hex}
                        className="relative w-5 h-5 rounded-full border border-gray-300"
                        title={color.name}
                      >
                        <span
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                      </div>
                    ))}
                    {uniqueColors.length > 5 && (
                      <span className="text-xs text-gray-500">+{uniqueColors.length - 5}</span>
                    )}
                  </>
                );
              })()}
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