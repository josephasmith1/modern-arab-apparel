'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ColorThief from 'colorthief';

interface ProductCardProps {
  product: any;
  index: number;
}

export default function ProductCardWithDynamicBg({ product, index }: ProductCardProps) {
  const [bgColor, setBgColor] = useState('#f3f4f6'); // Default gray
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const extractColor = async () => {
      if (!imgRef.current || !product.colors[0]?.images?.main) return;

      const colorThief = new ColorThief();
      const img = imgRef.current;

      // Create a new image element to load the image
      const tempImg = new window.Image();
      // Only set crossOrigin for remote images (Shopify CDN)
      if (product.colors[0].images.main.startsWith('http')) {
        tempImg.crossOrigin = 'anonymous';
      }
      
      tempImg.onload = () => {
        try {
          // Get the dominant color from the image
          const dominantColor = colorThief.getColor(tempImg, 10);
          
          // Get a palette of colors
          const palette = colorThief.getPalette(tempImg, 5, 10);
          
          // Try to find an edge color by getting colors from the palette
          // Often edge colors are lighter/neutral, so we'll pick the lightest color
          let edgeColor: number[] = dominantColor;
          let maxBrightness = 0;
          
          palette.forEach((color: number[]) => {
            const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
            if (brightness > maxBrightness && brightness > 200) { // Prefer lighter colors
              maxBrightness = brightness;
              edgeColor = [...color]; // Create a copy of the array
            }
          });
          
          // If no light color found, use the dominant color but lighten it
          if (maxBrightness === 0) {
            edgeColor = dominantColor.map((c: number) => Math.min(255, c + 50));
          }
          
          const rgb = `rgb(${edgeColor[0]}, ${edgeColor[1]}, ${edgeColor[2]})`;
          setBgColor(rgb);
        } catch (error) {
          console.error('Error extracting color:', error);
        }
      };

      tempImg.src = product.colors[0].images.main;
    };

    extractColor();
  }, [product]);

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
    >
      <Link href={`/products/${product.slug}`}>
        <div 
          className="relative h-96 overflow-hidden transition-colors duration-500"
          style={{ backgroundColor: bgColor }}
        >
          <Image
            ref={imgRef}
            src={product.colors[0]?.images?.main || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
            {product.name}
          </h3>
          <div className="flex items-center mt-2 mb-2">
            <div className="flex space-x-2">
              {(() => {
                // Filter out duplicate colors by hex value
                const uniqueColors = product.colors.filter((color: any, index: number, self: any[]) => 
                  self.findIndex(c => c.hex === color.hex) === index
                );
                
                return uniqueColors.length === 1 ? (
                  // Single color product - show just the color name
                  <span className="text-sm text-gray-600 font-barlow-condensed">
                    {uniqueColors[0].name}
                  </span>
                ) : (
                  // Multiple colors - show swatches
                  <>
                    {uniqueColors.slice(0, 5).map((color: any) => (
                      <span
                        key={color.hex}
                        className="block w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
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