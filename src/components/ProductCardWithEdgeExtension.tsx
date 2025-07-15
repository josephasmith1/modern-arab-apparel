'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  index: number;
}

export default function ProductCardWithEdgeExtension({ product, index }: ProductCardProps) {
  const [edgePattern, setEdgePattern] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const patternCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const createEdgePattern = async () => {
      if (!product.colors[0]?.images?.main) return;

      const img = new window.Image();
      // Only set crossOrigin for remote images (Shopify CDN)
      if (product.colors[0].images.main.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }
      
      img.onload = () => {
        if (!canvasRef.current || !patternCanvasRef.current) return;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const patternCanvas = patternCanvasRef.current;
        const patternCtx = patternCanvas.getContext('2d');
        
        if (!ctx || !patternCtx) return;

        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Create pattern canvas for edge extension
        const edgeWidth = 20; // Width of edge to sample
        patternCanvas.width = 400; // Pattern width
        patternCanvas.height = 400; // Pattern height
        
        try {
          // Sample and extend edges
          const sampleAndExtendEdge = (
            sourceX: number, 
            sourceY: number, 
            sourceWidth: number, 
            sourceHeight: number,
            destX: number,
            destY: number,
            destWidth: number,
            destHeight: number
          ) => {
            // Get the edge pixels
            const edgeData = ctx.getImageData(sourceX, sourceY, sourceWidth, sourceHeight);
            
            // Create a stretched/blurred version for smooth transition
            patternCtx.filter = 'blur(2px)';
            patternCtx.putImageData(edgeData, destX, destY);
            
            // Stretch the edge pixels to fill the destination area
            for (let i = 0; i < destWidth; i++) {
              for (let j = 0; j < destHeight; j++) {
                const sourceIndex = Math.min(
                  Math.floor(i * sourceWidth / destWidth),
                  sourceWidth - 1
                );
                const pixel = ctx.getImageData(
                  sourceX + sourceIndex, 
                  sourceY + Math.min(Math.floor(j * sourceHeight / destHeight), sourceHeight - 1), 
                  1, 
                  1
                );
                patternCtx.putImageData(pixel, destX + i, destY + j);
              }
            }
          };
          
          // Sample from all four edges and create a seamless pattern
          const cornerBlend = 50;
          
          // Top edge
          sampleAndExtendEdge(
            cornerBlend, 0, img.width - cornerBlend * 2, edgeWidth,
            cornerBlend, 0, patternCanvas.width - cornerBlend * 2, 100
          );
          
          // Right edge
          sampleAndExtendEdge(
            img.width - edgeWidth, cornerBlend, edgeWidth, img.height - cornerBlend * 2,
            patternCanvas.width - 100, cornerBlend, 100, patternCanvas.height - cornerBlend * 2
          );
          
          // Bottom edge
          sampleAndExtendEdge(
            cornerBlend, img.height - edgeWidth, img.width - cornerBlend * 2, edgeWidth,
            cornerBlend, patternCanvas.height - 100, patternCanvas.width - cornerBlend * 2, 100
          );
          
          // Left edge
          sampleAndExtendEdge(
            0, cornerBlend, edgeWidth, img.height - cornerBlend * 2,
            0, cornerBlend, 100, patternCanvas.height - cornerBlend * 2
          );
          
          // Sample corners for smooth transitions
          const corners = [
            { sx: 0, sy: 0, dx: 0, dy: 0 }, // Top-left
            { sx: img.width - cornerBlend, sy: 0, dx: patternCanvas.width - cornerBlend, dy: 0 }, // Top-right
            { sx: img.width - cornerBlend, sy: img.height - cornerBlend, dx: patternCanvas.width - cornerBlend, dy: patternCanvas.height - cornerBlend }, // Bottom-right
            { sx: 0, sy: img.height - cornerBlend, dx: 0, dy: patternCanvas.height - cornerBlend }, // Bottom-left
          ];
          
          corners.forEach(corner => {
            const cornerData = ctx.getImageData(corner.sx, corner.sy, cornerBlend, cornerBlend);
            patternCtx.putImageData(cornerData, corner.dx, corner.dy);
          });
          
          // Apply gradient overlay for smooth blending
          const gradient = patternCtx.createRadialGradient(
            patternCanvas.width / 2, patternCanvas.height / 2, 0,
            patternCanvas.width / 2, patternCanvas.height / 2, patternCanvas.width / 2
          );
          gradient.addColorStop(0, 'rgba(255,255,255,0)');
          gradient.addColorStop(0.7, 'rgba(255,255,255,0.1)');
          gradient.addColorStop(1, 'rgba(255,255,255,0.3)');
          
          patternCtx.globalCompositeOperation = 'source-over';
          patternCtx.fillStyle = gradient;
          patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
          
          // Convert pattern to data URL
          const patternDataUrl = patternCanvas.toDataURL();
          setEdgePattern(`url(${patternDataUrl})`);
          setIsLoading(false);
          
        } catch (error) {
          console.error('Error creating edge pattern:', error);
          setEdgePattern('');
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        console.error('Error loading image:', product.colors[0].images.main);
        setEdgePattern('');
        setIsLoading(false);
      };

      img.src = product.colors[0].images.main;
    };

    createEdgePattern();
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
            backgroundColor: '#f3f4f6',
            backgroundImage: edgePattern,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Hidden canvases for processing */}
          <canvas ref={canvasRef} className="hidden" />
          <canvas ref={patternCanvasRef} className="hidden" />
          
          {/* Gradient overlay for smooth blending */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.2) 70%, rgba(255,255,255,0.4) 100%)'
            }}
          />
          
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