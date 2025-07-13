'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  index: number;
}

export default function ProductCardSimpleEdge({ product, index }: ProductCardProps) {
  const [edgeColors, setEdgeColors] = useState({
    top: '#f3f4f6',
    right: '#f3f4f6',
    bottom: '#f3f4f6',
    left: '#f3f4f6',
  });

  useEffect(() => {
    const extractEdgeColors = () => {
      if (!product.colors[0]?.images?.main) return;

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to a manageable size for processing
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Draw scaled image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Function to get average color from a region
        const getAverageColor = (x: number, y: number, width: number, height: number): string => {
          try {
            const imageData = ctx.getImageData(
              Math.round(x), 
              Math.round(y), 
              Math.round(width), 
              Math.round(height)
            );
            const data = imageData.data;
            let r = 0, g = 0, b = 0, count = 0;
            
            // Sample every few pixels for performance
            for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
              const alpha = data[i + 3];
              if (alpha > 0) { // Only count non-transparent pixels
                r += data[i];
                g += data[i + 1];
                b += data[i + 2];
                count++;
              }
            }
            
            if (count === 0) return '#f3f4f6'; // Default if no valid pixels
            
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            
            // Lighten the color slightly for better background
            const lightenFactor = 1.2;
            r = Math.min(255, Math.round(r * lightenFactor));
            g = Math.min(255, Math.round(g * lightenFactor));
            b = Math.min(255, Math.round(b * lightenFactor));
            
            return `rgb(${r}, ${g}, ${b})`;
          } catch (e) {
            console.error('Error getting color:', e);
            return '#f3f4f6';
          }
        };
        
        try {
          const edgeSize = 5; // Sample 5px from edge
          
          // Get colors from each edge
          const colors = {
            top: getAverageColor(canvas.width * 0.25, 0, canvas.width * 0.5, edgeSize),
            right: getAverageColor(canvas.width - edgeSize, canvas.height * 0.25, edgeSize, canvas.height * 0.5),
            bottom: getAverageColor(canvas.width * 0.25, canvas.height - edgeSize, canvas.width * 0.5, edgeSize),
            left: getAverageColor(0, canvas.height * 0.25, edgeSize, canvas.height * 0.5),
          };
          
          setEdgeColors(colors);
        } catch (error) {
          console.error('Error extracting edge colors:', error);
        }
      };

      img.onerror = () => {
        console.error('Error loading image:', product.colors[0].images.main);
      };

      // Add timestamp to bypass cache if needed
      img.src = product.colors[0].images.main;
    };

    extractEdgeColors();
  }, [product]);

  // Create CSS gradient from edge colors
  const backgroundStyle = {
    background: `
      linear-gradient(to bottom, 
        ${edgeColors.top} 0%, 
        transparent 30%, 
        transparent 70%, 
        ${edgeColors.bottom} 100%
      ),
      linear-gradient(to right, 
        ${edgeColors.left} 0%, 
        transparent 30%, 
        transparent 70%, 
        ${edgeColors.right} 100%
      )
    `.trim()
  };

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
          className="relative h-96 overflow-hidden transition-all duration-700"
          style={backgroundStyle}
        >
          <Image
            src={product.colors[0]?.images?.main || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center group-hover:scale-105 transition-transform duration-500 relative z-10"
            priority={index < 6} // Priority for first 6 images
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-20"></div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
            {product.name}
          </h3>
          <div className="flex items-center mt-2 mb-2">
            <div className="flex space-x-2">
              {product.colors.length === 1 ? (
                <span className="text-sm text-gray-600 font-barlow-condensed">
                  {product.colors[0].name}
                </span>
              ) : (
                <>
                  {product.colors.slice(0, 5).map((color: any) => (
                    <span
                      key={color.name}
                      className="block w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="text-xs text-gray-500">+{product.colors.length - 5}</span>
                  )}
                </>
              )}
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