"use client";

import { useState, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { type Product, type ProductColor } from '@/data/products/sync';
import { type CartItem } from '@/app/products/types';



interface ProductMobileUIProps {
  product: Product;
  selectedColor: ProductColor;
  onColorSelect: (color: ProductColor) => void;
  extractedProductColors: { [key: string]: string };
  isScrolled: boolean;
  selectedSize: string;
  onSizeSelect: Dispatch<SetStateAction<string>>;
  quantity: number;
  onQuantityChange: Dispatch<SetStateAction<number>>;
  addItemToCart: (item: Omit<CartItem, 'id'>) => void;
  mobileColorSelectorOpacity: MotionValue<number>;
  mobileColorSelectorY: MotionValue<number>;
}

export default function ProductMobileUI({ 
  product, 
  selectedColor, 
  onColorSelect, 
  extractedProductColors,
  isScrolled,
  selectedSize,
  onSizeSelect,
  quantity,
  onQuantityChange,
  addItemToCart,
  mobileColorSelectorOpacity,
  mobileColorSelectorY
}: ProductMobileUIProps) {
  const [showColorOptions, setShowColorOptions] = useState(false);

  return (
    <>
      {/* Floating Color Selector for mobile */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 border-t border-gray-200 z-20 lg:hidden"
        style={{
          opacity: mobileColorSelectorOpacity,
          y: mobileColorSelectorY,
          display: isScrolled ? 'none' : 'block'
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Color</p>
            <p className="font-semibold text-black">{selectedColor.name}</p>
          </div>
          <button onClick={() => setShowColorOptions(!showColorOptions)} className="text-sm font-medium text-black hover:underline">Change</button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showColorOptions && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white p-6 border-t border-gray-200 z-30 shadow-2xl rounded-t-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select a Color</h3>
              <button onClick={() => setShowColorOptions(false)} className="text-gray-500 hover:text-black">&times;</button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => { onColorSelect(color); setShowColorOptions(false); }}
                  className="text-center"
                >
                  <div
                    className={`w-16 h-16 rounded-full mx-auto border-2 ${selectedColor.name === color.name ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: (extractedProductColors && extractedProductColors[color.name]) || color.hex || '#ccc' }}
                  ></div>
                  <p className={`mt-2 text-xs ${selectedColor.name === color.name ? 'font-semibold' : ''}`}>{color.name}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Add to Cart Bar for mobile */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-20 lg:hidden"
        style={{
          display: isScrolled ? 'block' : 'none'
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold text-black">Size</h3>
            <div className="flex flex-wrap gap-2">
              {selectedColor.variants.map((variant) => (
                <button
                  key={variant.size}
                  onClick={() => onSizeSelect(variant.size)}
                  disabled={!variant.available}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    selectedSize === variant.size
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                  } ${
                    !variant.available
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => onQuantityChange(q => Math.max(1, q - 1))} className="px-4 py-2 text-gray-600 hover:bg-gray-100">-</button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button onClick={() => onQuantityChange(q => q + 1)} className="px-4 py-2 text-gray-600 hover:bg-gray-100">+</button>
            </div>
            <AddToCartButton
              onAddToCart={() => {
                if (selectedSize) {
                  const variant = selectedColor.variants.find(v => v.size === selectedSize);
                  addItemToCart({
                    name: product.name,
                    vendor: product.vendor,
                    tags: product.tags,
                    price: variant ? `$${variant.price.toFixed(2)}` : '$0.00',
                    image: selectedColor.images.main,
                    color: selectedColor.name,
                    size: selectedSize,
                    quantity: quantity,
                  });
                }
              }}
              price={`$${(selectedColor.variants.find(v => v.size === selectedSize)?.price || 0).toFixed(2)}`}
              disabled={!selectedSize || !selectedColor.variants.find(v => v.size === selectedSize)?.available}
            />
          </div>
        </div>
      </motion.div>
    </>
  );
}
