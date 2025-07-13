'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  index: number;
}

export default function ProductCardSolidEdge({ product, index }: ProductCardProps) {
  const [bgColor, setBgColor] = useState('#f5f5f4'); // Default beige

  useEffect(() => {
    const extractEdgeColor = () => {
      if (!product.colors[0]?.images?.main) return;

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use smaller size for faster processing
        const size = 100;
        canvas.width = size;
        canvas.height = size;
        
        // Draw scaled image
        ctx.drawImage(img, 0, 0, size, size);
        
        // Sample pixels from all edges
        const edgePixels: number[][] = [];
        const sampleDepth = 5; // How many pixels deep to sample
        
        // Top edge
        for (let x = 0; x < size; x += 2) {
          for (let y = 0; y < sampleDepth; y++) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              if (pixel[3] > 0) { // Only if not transparent
                edgePixels.push([pixel[0], pixel[1], pixel[2]]);
              }
            } catch (e) {}
          }
        }
        
        // Bottom edge
        for (let x = 0; x < size; x += 2) {
          for (let y = size - sampleDepth; y < size; y++) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              if (pixel[3] > 0) {
                edgePixels.push([pixel[0], pixel[1], pixel[2]]);
              }
            } catch (e) {}
          }
        }
        
        // Left edge
        for (let y = 0; y < size; y += 2) {
          for (let x = 0; x < sampleDepth; x++) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              if (pixel[3] > 0) {
                edgePixels.push([pixel[0], pixel[1], pixel[2]]);
              }
            } catch (e) {}
          }
        }
        
        // Right edge
        for (let y = 0; y < size; y += 2) {
          for (let x = size - sampleDepth; x < size; x++) {
            try {
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              if (pixel[3] > 0) {
                edgePixels.push([pixel[0], pixel[1], pixel[2]]);
              }
            } catch (e) {}
          }
        }
        
        if (edgePixels.length > 0) {
          // Calculate average color
          let r = 0, g = 0, b = 0;
          edgePixels.forEach(pixel => {
            r += pixel[0];
            g += pixel[1];
            b += pixel[2];
          });
          
          r = Math.round(r / edgePixels.length);
          g = Math.round(g / edgePixels.length);
          b = Math.round(b / edgePixels.length);
          
          // Lighten the color for a softer background
          const lighten = (value: number) => Math.min(255, Math.round(value + (255 - value) * 0.5));
          r = lighten(r);
          g = lighten(g);
          b = lighten(b);
          
          setBgColor(`rgb(${r}, ${g}, ${b})`);
        }
      };

      img.onerror = () => {
        console.error('Error loading image:', product.colors[0].images.main);
      };

      img.src = product.colors[0].images.main;
    };

    extractEdgeColor();
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
                const uniqueColors = product.colors.filter((color: any, index: number, self: any[]) => 
                  self.findIndex(c => c.hex === color.hex) === index
                );
                
                return uniqueColors.length === 1 ? (
                  <span className="text-sm text-gray-600 font-barlow-condensed">
                    {uniqueColors[0].name}
                  </span>
                ) : (
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