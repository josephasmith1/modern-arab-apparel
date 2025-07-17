"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MiniCart from '@/components/cart/MiniCart';
import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { itemCount, openCart, isOpen, closeCart, items, updateQuantity, removeItem } = useCart();
  const [isArabic, setIsArabic] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="h-24 px-8 flex items-center justify-between backdrop-blur-sm shadow-2xl border-b border-gray-300 sticky top-0 z-50" style={{ backgroundColor: 'rgba(240, 237, 236, 0.95)' }}>
        {/* Left Section */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
            <Image
              src="/images/black_transparent_logo_x90@2x (1).png"
              alt="Modern Arab Apparel Logo"
              width={120} // Reduced size for better fit
              height={54}  // Reduced size for better fit
              priority
              className="h-12 w-auto drop-shadow-sm"
            />
            <div 
              className={`cursor-pointer transition-colors mt-1 ${isArabic ? "text-md text-gray-700 font-normal font-arabic hover:text-gray-900" : "text-sm text-black hover:text-gray-600 font-medium font-my-soul"}`}
              dir={isArabic ? "rtl" : "ltr"}
              onClick={(e) => { e.preventDefault(); setIsArabic(!isArabic); }}
            >
              {isArabic ? "ألا تخافون من الله" : "Do You Not Fear Allah?"}
            </div>
          </Link>
        </div>

        {/* Center Section */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul" style={{ fontSize: '30px' }}>Shop</Link>
            <Link href="/lifestyle" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul" style={{ fontSize: '30px' }}>Lifestyle</Link>
            <div className="relative group">
              <Link href="/collections" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul flex items-center" style={{ fontSize: '30px' }}>
                Collections
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/collections" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>All Collections</Link>
                <Link href="/collections/upperwear" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>Tops</Link>
                <Link href="/collections/layers" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>Layers</Link>
                <Link href="/collections/headwear" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>Headwear</Link>
                <Link href="/collections/bottoms" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>Bottoms</Link>
              </div>
            </div>
            <Link href="/about" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul" style={{ fontSize: '30px' }}>About</Link>
            <Link href="/faqs" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul" style={{ fontSize: '30px' }}>FAQs</Link>
            <Link href="/contact" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul" style={{ fontSize: '30px' }}>Contact</Link>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-end items-center space-x-4">
          <button onClick={openCart} className="relative hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      <MiniCart 
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 flex flex-col p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold font-my-soul">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Navigation */}
              <nav className="flex-grow mt-6 overflow-y-auto">
                <Link 
                  href="/products" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xl font-medium text-black hover:text-gray-600 transition-colors font-my-soul"
                  style={{ fontSize: '28px' }}
                >
                  Shop
                </Link>
                
                <Link 
                  href="/lifestyle" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xl font-medium text-black hover:text-gray-600 transition-colors font-my-soul"
                  style={{ fontSize: '28px' }}
                >
                  Lifestyle
                </Link>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <Link 
                  href="/collections" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xl font-medium text-black hover:text-gray-600 transition-colors font-my-soul"
                  style={{ fontSize: '28px' }}
                >
                  All Collections
                </Link>
                
                <Link 
                  href="/collections/upperwear" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-lg text-gray-700 hover:text-black transition-colors font-my-soul"
                  style={{ fontSize: '24px' }}
                >
                  → Tops
                </Link>
                
                <Link 
                  href="/collections/layers" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-lg text-gray-700 hover:text-black transition-colors font-my-soul"
                  style={{ fontSize: '24px' }}
                >
                  → Layers
                </Link>
                
                <Link 
                  href="/collections/headwear" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-lg text-gray-700 hover:text-black transition-colors font-my-soul"
                  style={{ fontSize: '24px' }}
                >
                  → Headwear
                </Link>
                
                <Link 
                  href="/collections/bottoms" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 pl-4 text-lg text-gray-700 hover:text-black transition-colors font-my-soul"
                  style={{ fontSize: '24px' }}
                >
                  → Bottoms
                </Link>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xl font-medium text-black hover:text-gray-600 transition-colors font-my-soul"
                  style={{ fontSize: '28px' }}
                >
                  About
                </Link>
                
                <Link 
                  href="/faqs" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xl font-medium text-black hover:text-gray-600 transition-colors font-my-soul"
                  style={{ fontSize: '28px' }}
                >
                  FAQs
                </Link>
                
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-xl font-medium text-black hover:text-gray-600 transition-colors font-my-soul"
                  style={{ fontSize: '28px' }}
                >
                  Contact
                </Link>
              </nav>
              
              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                <div 
                  className={`text-center cursor-pointer transition-colors ${isArabic ? "text-lg text-gray-700 font-normal font-arabic hover:text-gray-900" : "text-black hover:text-gray-600 font-medium font-my-soul"}`}
                  style={!isArabic ? { fontSize: '24px' } : {}}
                  dir={isArabic ? "rtl" : "ltr"}
                  onClick={() => setIsArabic(!isArabic)}
                >
                  {isArabic ? "ألا تخافون من الله" : "Do You Not Fear Allah?"}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
