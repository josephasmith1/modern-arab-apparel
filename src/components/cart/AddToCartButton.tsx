"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Check, ShoppingBag, Plus } from 'lucide-react';

interface AddToCartButtonProps {
  onAddToCart: () => void;
  disabled?: boolean;
  price: string;
  className?: string;
}

export default function AddToCartButton({ onAddToCart, disabled, price, className = "" }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleClick = async () => {
    if (disabled || isAdding) return;
    
    setIsAdding(true);
    
    // Simulate add to cart process
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onAddToCart();
    setIsAdding(false);
    setJustAdded(true);
    
    // Reset success state after 2 seconds
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isAdding}
      className={`
        relative w-full overflow-hidden
        bg-black text-white 
        disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
        transition-all duration-300
        ${className}
      `}
      style={{ height: '48px' }}
      whileHover={!disabled && !isAdding ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isAdding ? { scale: 0.98 } : {}}
      layout
    >
      {/* Background morphing effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black"
        initial={{ x: '-100%' }}
        animate={isAdding ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      {/* Success background */}
      <AnimatePresence>
        {justAdded && (
          <motion.div
            className="absolute inset-0 bg-green-600"
            initial={{ scale: 0, borderRadius: '50%' }}
            animate={{ scale: 1, borderRadius: '0%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-sm font-medium">Adding...</span>
            </motion.div>
          ) : justAdded ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              >
                <Check className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-medium">Added to Cart!</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between w-full px-4"
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ShoppingBag className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium">Add to Cart</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm font-bold">{price}</span>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Plus className="w-3 h-3" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Hover effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}