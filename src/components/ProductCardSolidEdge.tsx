

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useColorExtractor } from '@/hooks/useColorExtractor';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Product, ProductColor as Color } from '@/data/products/types';

interface ProductCardProps {
  product: Product;
  index: number;
  showLifestyleImage?: boolean;
  cardHeight?: string;
  imageObjectFit?: 'contain' | 'cover';
}

// Global queue for managing concurrent color extractions
let extractionQueue: Promise<void> = Promise.resolve();
let activeExtractions = 0;
const MAX_CONCURRENT_EXTRACTIONS = 3;

export default function ProductCardSolidEdge({ product, index, showLifestyleImage = false, cardHeight = 'h-[500px]', imageObjectFit = 'contain' }: ProductCardProps) {
  const [bgColor, setBgColor] = useState('#f5f5f4'); // Default beige
  const [extractedColors, setExtractedColors] = useState<{ [key: string]: string }>({});
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { extractImageColor, extractBackgroundColor } = useColorExtractor();
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  useEffect(() => {
    // Extract background color only when visible and not too many extractions are happening
    if (isIntersecting && product.colors && product.colors.length > 0 && product.colors[0]?.images?.main) {
      // Skip background extraction if we already have many active extractions
      if (activeExtractions < MAX_CONCURRENT_EXTRACTIONS) {
        extractBackgroundColor(product.colors[0].images.main, (extractedBgColor: string) => {
          setBgColor(extractedBgColor);
        });
      }
    }
  }, [product, extractBackgroundColor, isIntersecting]);

  // Extract colors from images for accurate swatches only when visible
  useEffect(() => {
    if (isIntersecting && product.colors && product.colors.length > 0) {
      // Create new abort controller for this extraction
      abortControllerRef.current = new AbortController();
      const currentAbortController = abortControllerRef.current;
      
      // Check if we need to extract any colors
      const colorsToExtract = product.colors.filter((color: Color) => 
        color.images?.main && !extractedColors[color.name]
      );
      
      if (colorsToExtract.length === 0) {
        return;
      }
      
      // Only extract colors for the first 3 color variants to improve performance
      const limitedColors = colorsToExtract.slice(0, 3);
      
      // Start extraction process
      
      // Queue the extraction to limit concurrent operations
      extractionQueue = extractionQueue.then(async () => {
        // Check if this extraction was aborted
        if (currentAbortController.signal.aborted) return;
        
        // Wait if too many extractions are active
        while (activeExtractions >= MAX_CONCURRENT_EXTRACTIONS) {
          await new Promise(resolve => setTimeout(resolve, 50));
          if (currentAbortController.signal.aborted) return;
        }
        
        activeExtractions++;
        
        try {
          // Extract colors with staggered delays
          for (let i = 0; i < limitedColors.length; i++) {
            if (currentAbortController.signal.aborted) break;
            
            const color = limitedColors[i];
            // Add delay between extractions to prevent blocking
            if (i > 0) {
              await new Promise(resolve => setTimeout(resolve, 30));
            }
            
            if (!currentAbortController.signal.aborted) {
              await new Promise<void>((resolve) => {
                extractImageColor(color.images.main, (extractedColor: string) => {
                  if (!currentAbortController.signal.aborted) {
                    setExtractedColors((prev) => ({ ...prev, [color.name]: extractedColor }));
                  }
                  resolve();
                });
              });
            }
          }
        } finally {
          activeExtractions--;
        }
      });
    }
    
    // Cleanup on unmount or when dependencies change
    const timerId = timeoutRef.current;
    return () => {
      // Abort any ongoing extractions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [product.slug, product.colors, extractedColors, extractImageColor, isIntersecting]);

  return (
    <motion.div 
      ref={targetRef}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
                  <Link href={`/products/${product.slug}`}>
        <div 
          className={`relative ${cardHeight} overflow-hidden transition-colors duration-700`}
          style={{ backgroundColor: bgColor }}
        >
          <Image
            src={(() => {
              const color = product.colors[0];
              if (showLifestyleImage) {
                return color?.images?.lifestyle?.[0] || color?.images?.main || '/images/placeholder.jpg';
              }

              if (!isHovered) return color?.images?.main || '/images/placeholder.jpg';
              
              // Try back image first
              if (color?.images?.back) return color.images.back;
              
              // Then try first lifestyle image
              if (color?.images?.lifestyle?.[0]) return color.images.lifestyle[0];
              
              // Fallback to main image
              return color?.images?.main || '/images/placeholder.jpg';
            })()}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`${imageObjectFit === 'cover' ? 'object-cover' : 'object-contain'} group-hover:scale-105 transition-transform duration-500 relative z-10`}
            priority={index < 6}
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
                // Don't filter by hex - show all color variants
                const allColors = product.colors;
                
                return allColors.length === 1 ? (
                  <span className="text-sm text-gray-600 font-barlow-condensed">
                    {allColors[0].name}
                  </span>
                ) : (
                  <>
                    {allColors.slice(0, 5).map((color: Color, colorIndex: number) => (
                      <div
                        key={`${color.name}-${colorIndex}`}
                        className="relative w-5 h-5 rounded-full border border-gray-300 transition-all duration-300"
                        title={color.name}
                      >
                        <span
                          className="absolute inset-0 rounded-full transition-colors duration-500"
                          style={{ 
                            backgroundColor: colorIndex < 3 ? (extractedColors[color.name] || color.hex) : color.hex 
                          }}
                        />
                        {/* Only extract colors for first 3 swatches for performance */}
                      </div>
                    ))}
                    {allColors.length > 5 && (
                      <span className="text-xs text-gray-500">+{allColors.length - 5}</span>
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