'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer 
      className="relative overflow-hidden" 
      style={{ 
        background: 'linear-gradient(135deg, #f7f4f0 0%, #f2ede6 25%, #ede6dc 50%, #e8dfd2 75%, #f0e9df 100%)'
      }}
    >
      {/* Main Footer Section */}
      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Brand Story - Takes 1 column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium tracking-wide text-stone-600 uppercase font-barlow-condensed">
                  Modern Arab Apparel
                </span>
                <h3 className="text-2xl font-light text-stone-800 font-bodoni">
                  Changing the Narrative
                </h3>
              </div>
              <p className="text-base text-stone-700 leading-relaxed font-barlow-condensed max-w-md">
                Reclaiming the narrative through authentic Arabic culture and contemporary design. 
                Every piece we create is designed to inspire conversation and empower individuals.
              </p>
              <p className="text-stone-600 font-barlow-condensed font-medium text-sm">
                Made with purpose in Los Angeles.
              </p>
              
              {/* Arabic Text - Integrated into brand section */}
              <div className="pt-4">
                <div 
                  className="font-light font-bodoni leading-none text-stone-400/50"
                  style={{ fontSize: '2.5rem' }}
                >
                  ألآ تخافون من الله
                </div>
                <p className="text-sm text-stone-600 font-barlow-condensed mt-1">
                  &quot;Don&apos;t you fear God?&quot; - Our flagship message
                </p>
              </div>
            </div>

            {/* Navigation Links - 2 columns side by side */}
            <div className="md:flex md:space-x-12 space-y-4 md:space-y-0">
              <div className="space-y-4">
                <h4 className="text-lg font-light text-stone-800 font-bodoni">Shop</h4>
                <div className="space-y-2">
                  <Link href="/collections" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">All Collections</Link>
                  <Link href="/collections/upperwear" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">Tops & Tees</Link>
                  <Link href="/collections/layers" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">Layers</Link>
                  <Link href="/collections/headwear" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">Headwear</Link>
                  <Link href="/collections/bottoms" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">Bottoms</Link>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-light text-stone-800 font-bodoni">Support</h4>
                <div className="space-y-2">
                  <Link href="/about" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">About Us</Link>
                  <Link href="/faqs" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">FAQs</Link>
                  <Link href="/contact" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">Contact</Link>
                  <Link href="/faqs#shipping" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">Shipping & Returns</Link>
                  <Link href="/data-sharing-opt-out" className="block text-stone-700 hover:text-stone-900 transition-colors font-barlow-condensed">Privacy Policy</Link>
                </div>
                
                {/* Social Media - Moved to support column */}
                <div className="pt-4">
                  <h5 className="text-sm font-medium text-stone-700 mb-2 font-barlow-condensed">Follow Us</h5>
                  <div className="flex space-x-3">
                    <motion.a
                      href="https://instagram.com/modernarabapparel" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-8 h-8 border border-stone-500 hover:bg-stone-600 hover:text-stone-50 text-stone-600 flex items-center justify-center transition-all duration-300 rounded"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg className="w-4 h-4 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </motion.a>
                    <motion.a
                      href="https://twitter.com/modernarabapp" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-8 h-8 border border-stone-500 hover:bg-stone-600 hover:text-stone-50 text-stone-600 flex items-center justify-center transition-all duration-300 rounded"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg className="w-4 h-4 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </motion.a>
                    <motion.a
                      href="https://pinterest.com/modernarabapp" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-8 h-8 border border-stone-500 hover:bg-stone-600 hover:text-stone-50 text-stone-600 flex items-center justify-center transition-all duration-300 rounded"
                      whileHover={{ scale: 1.1 }}
                    >
                      <svg className="w-4 h-4 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.755-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright - Single line at bottom */}
          <div className="mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
              <p className="text-stone-600 font-barlow-condensed text-sm">
                © 2025 Modern Arab Apparel. All rights reserved.
              </p>
              <p className="text-stone-600 font-barlow-condensed text-sm">
                Designed in Los Angeles with authentic Arabic culture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;