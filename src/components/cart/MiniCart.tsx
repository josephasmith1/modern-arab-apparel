"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function MiniCart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: MiniCartProps) {
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Mini Cart Sidebar */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: items.length > 0 ? [0, -10, 10, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ShoppingBag className="w-6 h-6" />
                </motion.div>
                <div>
                  <h2 className="text-lg font-semibold text-black font-montserrat">Your Cart</h2>
                  <p className="text-sm text-gray-500 font-barlow-condensed">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col items-center justify-center py-16 px-6 text-center"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 font-montserrat">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6 font-barlow-condensed">Add some items to get started</p>
                    <motion.button
                      onClick={onClose}
                      className="bg-black text-white px-6 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue Shopping
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="p-4 space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-black truncate font-montserrat">
                            {item.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500 font-barlow-condensed">
                              {item.color}
                            </span>
                            <span className="text-xs text-gray-300">•</span>
                            <span className="text-xs text-gray-500 font-barlow-condensed">
                              Size {item.size}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-black mt-1 font-montserrat">
                            {item.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Minus className="w-3 h-3" />
                          </motion.button>
                          
                          <motion.span 
                            key={item.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="w-8 text-center text-sm font-medium font-montserrat"
                          >
                            {item.quantity}
                          </motion.span>
                          
                          <motion.button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Plus className="w-3 h-3" />
                          </motion.button>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="border-t border-gray-100 p-6 space-y-4"
              >
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-black font-montserrat">Total</span>
                  <motion.span 
                    key={total}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-lg font-bold text-black font-montserrat"
                  >
                    ${total.toFixed(2)}
                  </motion.span>
                </div>

                {/* Checkout Button */}
                <Link href="/cart" onClick={onClose}>
                  <motion.div
                    className="w-full bg-black text-white py-3 flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium font-montserrat">View Cart & Checkout</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </Link>

                {/* Continue Shopping */}
                <motion.button
                  onClick={onClose}
                  className="w-full text-gray-600 py-2 text-sm font-medium hover:text-black transition-colors font-barlow-condensed"
                  whileHover={{ scale: 1.02 }}
                >
                  Continue Shopping
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}