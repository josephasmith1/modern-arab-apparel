"use client";

import { Dispatch, SetStateAction, useEffect } from 'react';
import { type Product, type ProductColor, type CartItem } from '@/app/products/data';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
  selectedColor: ProductColor;
  onColorSelect: (color: ProductColor) => void;
  selectedSize: string;
  onSizeSelect: Dispatch<SetStateAction<string>>;
  quantity: number;
  onQuantityChange: Dispatch<SetStateAction<number>>;
  showSizeGuide: boolean;
  onShowSizeGuideChange: Dispatch<SetStateAction<boolean>>;
  sizeUnit: 'inches' | 'cm';
  onSizeUnitChange: Dispatch<SetStateAction<'inches' | 'cm'>>;
  addItemToCart: (item: Omit<CartItem, 'id'>) => void;
  extractedProductColors: { [key: string]: string };
}

export default function ProductInfo({ 
  product, 
  selectedColor, 
  onColorSelect, 
  selectedSize, 
  onSizeSelect, 
  quantity, 
  onQuantityChange,
  showSizeGuide,
  onShowSizeGuideChange,
  sizeUnit,
  onSizeUnitChange,
  addItemToCart,
  extractedProductColors
}: ProductInfoProps) {

  useEffect(() => {
    if (selectedColor.variants.length > 0 && !selectedColor.variants.find(v => v.size === selectedSize)) {
      const firstAvailableSize = selectedColor.variants.find(v => v.available);
      onSizeSelect(firstAvailableSize ? firstAvailableSize.size : '');
    }
  }, [selectedColor, selectedSize, onSizeSelect]);

  return (
    <div className="lg:sticky top-20 self-start">
      <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">{product.vendor}</p>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black font-bodoni">{product.name}</h1>
      <p className="text-2xl text-gray-700 mb-6">{product.price}</p>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {product.tags.map((tag) => (
            <span key={tag} className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="prose prose-lg max-w-none text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}></div>

      {/* Color Selector */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-black">Color: <span className="font-normal text-gray-600">{selectedColor.name}</span></h3>
        <div className="flex space-x-3">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorSelect(color)}
              className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 ${selectedColor.name === color.name ? 'border-black' : 'border-gray-300'}`}
              style={{ backgroundColor: (extractedProductColors && extractedProductColors[color.name]) || color.hex || '#ccc' }}
            >
              {selectedColor.name === color.name && (
                <div className="w-full h-full rounded-full border-2 border-white"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selector */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Size</h3>
          <button onClick={() => onShowSizeGuideChange(!showSizeGuide)} className="text-sm font-medium text-gray-600 hover:text-black">Size Guide</button>
        </div>
        <div className="flex flex-wrap gap-3">
          {selectedColor.variants.map((variant) => (
            <button
              key={variant.size}
              onClick={() => onSizeSelect(variant.size)}
              disabled={!variant.available}
              className={`px-6 py-3 rounded-lg border transition-colors ${
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

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button onClick={() => onQuantityChange(q => Math.max(1, q - 1))} className="px-4 py-3 text-gray-600 hover:bg-gray-100">-</button>
          <span className="px-4 py-3 font-medium">{quantity}</span>
          <button onClick={() => onQuantityChange(q => q + 1)} className="px-4 py-3 text-gray-600 hover:bg-gray-100">+</button>
        </div>
        <AddToCartButton
          onAddToCart={() => {
            if (selectedSize) {
              const variant = selectedColor.variants.find(v => v.size === selectedSize);
              addItemToCart({
                name: product.name,
                vendor: product.vendor,
                tags: product.tags,
                price: variant ? variant.price : 0,
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

      <AnimatePresence>
        {showSizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
            onClick={() => onShowSizeGuideChange(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => onShowSizeGuideChange(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4">Size Guide</h2>
              <div className="flex justify-center mb-4 border border-gray-200 rounded-full p-1">
                <button onClick={() => onSizeUnitChange('inches')} className={`px-4 py-1 rounded-full text-sm ${sizeUnit === 'inches' ? 'bg-black text-white' : ''}`}>Inches</button>
                <button onClick={() => onSizeUnitChange('cm')} className={`px-4 py-1 rounded-full text-sm ${sizeUnit === 'cm' ? 'bg-black text-white' : ''}`}>CM</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="py-2 font-semibold">Size</th>
                    <th className="py-2 font-semibold">Chest</th>
                    <th className="py-2 font-semibold">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {['S', 'M', 'L', 'XL', '2XL'].map(size => {
                    const measurements: { [key: string]: { chest: number, length: number } } = {
                      S: { chest: 38, length: 28 },
                      M: { chest: 41, length: 29 },
                      L: { chest: 44, length: 30 },
                      XL: { chest: 48, length: 31 },
                      '2XL': { chest: 52, length: 32 },
                    };
                    const { chest, length } = measurements[size];
                    const displayChest = sizeUnit === 'cm' ? (chest * 2.54).toFixed(1) : chest;
                    const displayLength = sizeUnit === 'cm' ? (length * 2.54).toFixed(1) : length;
                    return (
                      <tr key={size} className="border-t border-gray-200">
                        <td className="py-2">{size}</td>
                        <td className="py-2">{displayChest} {sizeUnit}</td>
                        <td className="py-2">{displayLength} {sizeUnit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
