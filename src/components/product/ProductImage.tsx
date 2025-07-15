"use client";

import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import { ProductColor } from '@/data/products/sync';

interface ProductImageProps {
  images: { url: string; type: string }[];
  productName: string;
  selectedColorName: string;
  heroOpacity: MotionValue<number>;
  heroScale: MotionValue<number>;
  heroX: MotionValue<number>;
  colorSelectorOpacity: MotionValue<number>;
  colorSelectorY: MotionValue<number>;
  productColors: ProductColor[];
  selectedColor: ProductColor;
  handleColorSelect: (color: ProductColor) => void;
  extractedProductColors: { [key: string]: string };
  imageBackgroundColors: { [key: string]: string };
  selectedImageIndex: number;
  setSelectedImageIndex: Dispatch<SetStateAction<number>>;
}

export default function ProductImage({ 
  images, 
  productName, 
  selectedColorName, 
  heroOpacity, 
  heroScale, 
  heroX, 
  colorSelectorOpacity,
  colorSelectorY,
  productColors,
  selectedColor,
  handleColorSelect,
  extractedProductColors,
  imageBackgroundColors,
  selectedImageIndex,
  setSelectedImageIndex
}: ProductImageProps) {

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const currentImage = images[selectedImageIndex]?.url;
  const currentBackgroundColor = currentImage ? imageBackgroundColors[currentImage] || '#f0edec' : '#f0edec';

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-screen z-5 overflow-hidden"
      style={{ opacity: heroOpacity, scale: heroScale, x: heroX }}
    >
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {currentImage && (
            <motion.div
              key={`${selectedColorName}-${selectedImageIndex}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0"
              style={{ backgroundColor: currentBackgroundColor }}
            >
              <Image
                src={currentImage}
                alt={`${productName} - ${selectedColorName}`}
                fill
                objectFit="contain"
                className="w-full h-full"
                priority
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevImage} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button onClick={nextImage} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full hover:bg-black/50 transition-colors z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Image index dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${selectedImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>

      {/* Color Selector Overlay - Only show if more than one color */}
      {productColors.length > 1 && (
        <motion.div 
          className="absolute top-24 right-8 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg"
          style={{ opacity: colorSelectorOpacity, y: colorSelectorY }}
        >
          <div className="flex flex-col space-y-3">
            {productColors.map(color => (
              <button 
                key={color.name}
                onClick={() => handleColorSelect(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${selectedColor.name === color.name ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ 
                  backgroundColor: extractedProductColors[color.name] || '#ccc',
                  boxShadow: selectedColor.name === color.name ? `0 0 15px 2px ${extractedProductColors[color.name] || '#ccc'}` : 'none'
                }}
              >
                {!extractedProductColors[color.name] && <div className="w-full h-full rounded-full bg-gray-200 animate-pulse"></div>}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
