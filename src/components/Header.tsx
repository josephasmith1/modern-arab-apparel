"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import MiniCart from '@/components/cart/MiniCart';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { itemCount, openCart, isOpen, closeCart, items, updateQuantity, removeItem } = useCart();

  return (
    <>
      <header className="h-16 px-8 flex items-center justify-between backdrop-blur-sm shadow-2xl border-b border-gray-300 sticky top-0 z-50 relative" style={{ backgroundColor: 'rgba(240, 237, 236, 0.95)' }}>
    <div className="flex items-center">
      <span className="text-lg text-gray-700 font-normal font-arabic">
        ألآ تخافون من الله
      </span>
    </div>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity pointer-events-auto">
            <Image
                src="/product-images/black_transparent_logo_x90@2x.png"
                alt="Modern Arab Apparel Logo"
                width={240}
                height={107}
                className="h-20 w-auto drop-shadow-sm relative z-10"
                style={{ transform: 'scale(1.2)' }}
            />
        </Link>
    </div>
    <div className="flex items-center space-x-6">
      <nav className="hidden md:flex items-center space-x-6">
        <div className="relative group">
          <Link href="/products" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul flex items-center" style={{ fontSize: '30px' }}>
            Products
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/products" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>All Products</Link>
            <Link href="/products?category=tees" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>T-Shirts</Link>
            <Link href="/products?category=hoodies" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>Hoodies</Link>
            <Link href="/products?category=headwear" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>Headwear</Link>
            <Link href="/products?category=bottoms" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul" style={{ fontSize: '25px' }}>Bottoms</Link>
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
        <button className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-colors">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
</>
  );
};

export default Header;
