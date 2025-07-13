'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  index: number;
}

interface EdgeColors {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export default function ProductCardWithEdgeGradient({ product, index }: ProductCardProps) {
  const [gradient, setGradient] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const extractEdgeColors = async () => {
      if (!product.colors[0]?.images?.main) return;

      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        if (!canvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Function to get average color from a region
        const getAverageColor = (x: number, y: number, width: number, height: number): string => {
          const imageData = ctx.getImageData(x, y, width, height);
          const data = imageData.data;
          let r = 0, g = 0, b = 0;
          let count = 0;
          
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          return `rgb(${r}, ${g}, ${b})`;
        };
        
        // Sample size for edge detection (10px strip from edge)
        const sampleDepth = 10;
        const cornerSize = 50; // Size of corner sample
        
        try {
          // Get colors from corners (50x50 pixel areas)
          const topLeft = getAverageColor(0, 0, cornerSize, cornerSize);
          const topRight = getAverageColor(img.width - cornerSize, 0, cornerSize, cornerSize);
          const bottomLeft = getAverageColor(0, img.height - cornerSize, cornerSize, cornerSize);
          const bottomRight = getAverageColor(img.width - cornerSize, img.height - cornerSize, cornerSize, cornerSize);
          
          // Get colors from edge centers (10px strips)
          const topEdge = getAverageColor(img.width / 2 - 25, 0, 50, sampleDepth);
          const rightEdge = getAverageColor(img.width - sampleDepth, img.height / 2 - 25, sampleDepth, 50);
          const bottomEdge = getAverageColor(img.width / 2 - 25, img.height - sampleDepth, 50, sampleDepth);
          const leftEdge = getAverageColor(0, img.height / 2 - 25, sampleDepth, 50);
          
          // Create a complex gradient using multiple color stops
          // This creates a gradient that mimics the edge colors of the image
          const gradientOptions = [
            // Radial gradient from center
            `radial-gradient(ellipse at center, transparent 40%, ${topEdge} 70%, ${bottomEdge} 100%)`,
            
            // Conic gradient for smooth corner transitions
            `conic-gradient(from 0deg at 50% 50%, ${topLeft}, ${topEdge}, ${topRight}, ${rightEdge}, ${bottomRight}, ${bottomEdge}, ${bottomLeft}, ${leftEdge}, ${topLeft})`,
            
            // Linear gradient with multiple stops
            `linear-gradient(135deg, ${topLeft} 0%, ${topEdge} 25%, transparent 40%, ${bottomEdge} 75%, ${bottomRight} 100%)`,
            
            // Multiple linear gradients layered
            `linear-gradient(to bottom, ${topEdge} 0%, transparent 30%, transparent 70%, ${bottomEdge} 100%),
             linear-gradient(to right, ${leftEdge} 0%, transparent 30%, transparent 70%, ${rightEdge} 100%)`,
          ];
          
          // Use a combination of gradients for the most natural look
          const finalGradient = `
            radial-gradient(ellipse at center, transparent 30%, ${topEdge}40 60%, ${bottomEdge}60 100%),
            linear-gradient(135deg, ${topLeft} 0%, ${topRight} 50%, ${bottomRight} 100%)
          `;
          
          setGradient(finalGradient);
          setIsLoading(false);
        } catch (error) {
          console.error('Error extracting edge colors:', error);
          // Fallback to a simple gradient
          setGradient('linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)');
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error('Error loading image:', product.colors[0].images.main);
        setGradient('linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)');
        setIsLoading(false);
      };

      img.src = product.colors[0].images.main;
    };

    extractEdgeColors();
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
          className="relative h-96 overflow-hidden transition-all duration-700"
          style={{ 
            background: isLoading ? '#f3f4f6' : gradient,
          }}
        >
          {/* Hidden canvas for color extraction */}
          <canvas ref={canvasRef} className="hidden" />
          
          <Image
            src={product.colors[0]?.images?.main || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain object-center group-hover:scale-105 transition-transform duration-500 relative z-10"
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