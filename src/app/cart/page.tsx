"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, X, ShoppingBag, Truck, Shield, RotateCcw, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, total: cartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + (price * item.quantity);
  }, 0);
  const shipping = subtotal > 50 ? 0 : 8.99;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'welcome10') {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.div 
        className="border-b border-gray-100 sticky top-0 bg-white z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/products">
                <motion.div 
                  className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
                  whileHover={{ x: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium font-barlow-condensed">Continue Shopping</span>
                </motion.div>
              </Link>
            </div>
            
            <motion.h1 
              className="text-2xl font-light text-black font-bodoni"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Shopping Cart
            </motion.h1>
            
            <div className="w-32"></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </motion.div>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <motion.div
          className="flex flex-col items-center justify-center py-20 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ShoppingBag className="w-24 h-24 text-gray-200 mb-8" />
          </motion.div>
          <h2 className="text-3xl font-light text-black mb-4 font-bodoni">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 text-center max-w-md font-barlow-condensed">
            Looks like you haven&apos;t added anything to your cart yet. 
            Discover our collection of modern Arabic apparel.
          </p>
          <Link href="/products">
            <motion.div
              className="bg-black text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors cursor-pointer font-montserrat"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Products
            </motion.div>
          </Link>
        </motion.div>
      ) : (
        // Cart with Items
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-medium text-black font-montserrat">
                    Your Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                  </h2>
                </div>

                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-6 p-6 border border-gray-100 bg-gray-50"
                      >
                        {/* Product Image */}
                        <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-black mb-2 font-montserrat">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3 font-barlow-condensed">
                            <span>Color: {item.color}</span>
                            <span>•</span>
                            <span>Size: {item.size}</span>
                          </div>
                          <p className="text-lg font-semibold text-black font-montserrat">
                            {item.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3 border border-gray-200 bg-white">
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-3 hover:bg-gray-50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            
                            <motion.span 
                              key={item.quantity}
                              initial={{ scale: 1.2 }}
                              animate={{ scale: 1 }}
                              className="w-12 text-center font-medium font-montserrat"
                            >
                              {item.quantity}
                            </motion.span>
                            
                            <motion.button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-3 hover:bg-gray-50 transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[100px]">
                          <motion.p 
                            key={item.quantity * item.price}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="text-lg font-semibold text-black font-montserrat"
                          >
                            ${(item.quantity * parseFloat(item.price.replace('$', ''))).toFixed(2)}
                          </motion.p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-32">
                <div className="bg-black text-white p-8">
                  <h3 className="text-xl font-medium mb-6 font-montserrat">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between font-barlow-condensed">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between font-barlow-condensed">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    
                    {promoApplied && (
                      <motion.div 
                        className="flex justify-between text-green-400 font-barlow-condensed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </motion.div>
                    )}
                    
                    <div className="border-t border-gray-600 pt-4">
                      <div className="flex justify-between text-lg font-semibold font-montserrat">
                        <span>Total</span>
                        <motion.span
                          key={total}
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  {!promoApplied && (
                    <div className="mb-6">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white text-black text-sm border border-gray-300 focus:outline-none font-barlow-condensed"
                        />
                        <motion.button
                          onClick={applyPromoCode}
                          className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors font-barlow-condensed"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Apply
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <motion.button
                    className="w-full bg-white text-black py-4 font-semibold text-lg hover:bg-gray-100 transition-colors mb-4 font-montserrat"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Checkout
                  </motion.button>

                  {/* Security Icons */}
                  <div className="space-y-3 text-sm text-gray-300 font-barlow-condensed">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Truck className="w-4 h-4" />
                      <span>Free shipping over $50</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RotateCcw className="w-4 h-4" />
                      <span>30-day returns</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-4 h-4" />
                      <span>Multiple payment options</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}