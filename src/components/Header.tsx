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
      <header className="h-16 px-8 flex items-center justify-between backdrop-blur-sm shadow-2xl border-b border-gray-300 sticky top-0 z-50" style={{ backgroundColor: 'rgba(240, 237, 236, 0.95)' }}>
    <div className="flex items-center">
      <div 
        className={`cursor-pointer transition-colors ${isArabic ? "text-lg text-gray-700 font-normal font-arabic hover:text-gray-900" : "text-black hover:text-gray-600 font-medium font-my-soul"}`}
        style={!isArabic ? { fontSize: '30px' } : {}}
        dir={isArabic ? "rtl" : "ltr"}
        onClick={() => setIsArabic(!isArabic)}
      >
        {isArabic ? "ألا تخافون من الله" : "Do You Not Fear Allah?"}
      </div>
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity pointer-events-auto">
            <Image
                src="/product-images/black_transparent_logo_x90@2x.png"
                alt="Modern Arab Apparel Logo"
                width={240}
                height={107}
                priority
                className="h-20 w-auto drop-shadow-sm relative z-10"
                style={{ transform: 'scale(1.2)' }}
            />
        </Link>
    </div>
    <div className="flex items-center space-x-6">
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
      <div className="flex items-center space-x-4">
        <motion.button 
          onClick={openCart}
          className="relative p-2 hover:bg-gray-200 rounded-full transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {itemCount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
    </div>
  </header>
  
  <MiniCart 
    isOpen={isOpen}
    onClose={closeCart}
    items={items}
    onUpdateQuantity={updateQuantity}
    onRemoveItem={removeItem}
  />

  {/* Mobile Menu Slideout Panel */}
  <AnimatePresence>
    {isMobileMenuOpen && (
      <>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
        
        {/* Menu Panel */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl z-50 md:hidden"
          style={{ backgroundColor: '#f0edec' }}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold font-bodoni">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Menu Links */}
          <nav className="p-6">
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
