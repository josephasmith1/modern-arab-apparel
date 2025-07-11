"use client";

import Image from 'next/image';
import { useState, use, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { products } from '../data';
import productsJson from '../../../../data/products.json';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  
  // First try to find in detailed products data
  let productData = products.find(p => p.slug === resolvedParams.slug);
  
  // If still not found, try simple products.json
  if (!productData) {
    const simpleProduct = productsJson.find(p => p.slug === resolvedParams.slug);
    if (simpleProduct) {
      // Create a basic product structure for simple products
      productData = {
        slug: simpleProduct.slug,
        name: simpleProduct.name,
        price: simpleProduct.price,
        originalPrice: simpleProduct.price,
        description: simpleProduct.description || "A statement piece that combines cultural heritage with modern streetwear.",
        fullDescription: "This premium piece represents modern Arabic culture with authentic design elements. Made from high-quality materials with attention to detail.",
        features: [
          "Unisex fit",
          "Premium materials",
          "Modern Arabic branding",
          "Designed in Los Angeles",
          "Comfortable daily wear"
        ],
        specifications: {
          material: "Premium cotton blend",
          weight: "Medium weight",
          fit: "Relaxed unisex fit",
          origin: "Designed in Los Angeles, USA"
        },
        sizeGuide: [
          { size: "S", length: "27\"", chest: "39\"", sleeve: "9\"", lengthCm: "68.6", chestCm: "99", sleeveCm: "23" },
          { size: "M", length: "29\"", chest: "43\"", sleeve: "9.5\"", lengthCm: "73.7", chestCm: "109", sleeveCm: "24" },
          { size: "L", length: "30\"", chest: "47\"", sleeve: "10\"", lengthCm: "76.2", chestCm: "119", sleeveCm: "25" },
          { size: "XL", length: "32\"", chest: "51\"", sleeve: "10.5\"", lengthCm: "81.3", chestCm: "130", sleeveCm: "27" }
        ],
        colors: [
          {
            name: "Default",
            swatch: "bg-gray-800",
            hex: "#374151",
            images: {
              main: simpleProduct.image || '/images/modern-arab-faded-tee-faded-khaki-front.jpg',
              back: '/images/modern-arab-faded-tee-faded-khaki-back.jpg',
              lifestyle: []
            }
          }
        ]
      };
    }
  }

  if (!productData) {
    notFound();
  }

  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'inches' | 'cm'>('inches');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Scroll tracking
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.8]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);
  
  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', updateScrollState);
    updateScrollState();
    
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  // Create comprehensive image gallery for selected color
  const getCurrentImages = () => {
    const images = [];
    if (selectedColor.images.main) images.push({ url: selectedColor.images.main, type: 'main' });
    if (selectedColor.images.back) images.push({ url: selectedColor.images.back, type: 'back' });
    if (selectedColor.images.lifestyle) {
      selectedColor.images.lifestyle.forEach((img, index) => {
        images.push({ url: img, type: `lifestyle-${index}` });
      });
    }
    return images;
  };

  const currentImages = getCurrentImages();

  const nextImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };


  return (
    <div className="text-black" style={{ backgroundColor: '#f0edec' }}>
      {/* Sticky Hero Section */}
      <motion.section 
        className="fixed top-0 left-0 w-full h-screen z-0"
        style={{ 
          scale: heroScale, 
          opacity: heroOpacity,
          transformOrigin: 'center center'
        }}
      >
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full h-full"
            >
              <Image
                src={currentImages[selectedImageIndex]?.url || selectedColor.images.main}
                alt={`${productData.name} - ${selectedColor.name}`}
                fill
                className="object-cover object-center"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Navigation Arrows */}
        {currentImages.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        {currentImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {selectedImageIndex + 1} / {currentImages.length}
          </div>
        )}

        {/* Thumbnail Navigation */}
        {currentImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {currentImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImageIndex === index 
                    ? 'border-white shadow-lg' 
                    : 'border-gray-400 hover:border-gray-200'
                }`}
              >
                <Image
                  src={image.url}
                  alt={`${productData.name} thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover object-center"
                />
              </button>
            ))}
          </div>
        )}
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ y: contentY }}
        >
          <div className="text-center max-w-4xl px-6">
            <motion.h1 
              className="text-6xl md:text-8xl font-light mb-4 text-white drop-shadow-2xl font-bodoni"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {productData.name}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              {productData.price}
            </motion.p>
            <motion.button 
              className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-2xl"
              onClick={() => document.getElementById('product-info')?.scrollIntoView({ behavior: 'smooth' })}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DISCOVER
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* Spacer for scroll */}
      <div className="h-screen"></div>

      {/* Product Info Section - Two Column Layout */}
      <section id="product-info" className="relative z-10 min-h-screen" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Left Column - Product Details */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-light mb-6 text-black font-bodoni">
                  A Statement of Heritage
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl leading-relaxed mb-6 text-black">{productData.description}</p>
                  <p className="text-lg text-gray-700 leading-relaxed">{productData.fullDescription}</p>
                </div>
              </div>
              
              {/* Features List */}
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-black font-bodoni">Key Features</h3>
                <ul className="space-y-3">
                  {productData.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center text-gray-700"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right Column - Product Selection */}
            <motion.div 
              className={`space-y-8 ${isScrolled ? 'lg:sticky lg:top-8' : ''}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-black font-bodoni">Customize Your Order</h3>
                
                {/* Product Selection */}
                <div className="space-y-8">
                  {/* Color Selection */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-black">Choose Your Color</h4>
                      <p className="text-gray-600 text-sm">{selectedColor.name}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      {productData.colors.map((color) => (
                        <motion.button
                          key={color.name}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedImageIndex(0);
                          }}
                          className={`relative w-16 h-16 rounded-full border-4 transition-all ${
                            selectedColor.name === color.name 
                              ? 'border-black shadow-lg scale-110' 
                              : 'border-gray-400 hover:border-gray-600'
                          }`}
                          whileHover={{ scale: selectedColor.name === color.name ? 1.1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span 
                            className="absolute inset-2 rounded-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="sr-only">{color.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-black">Select Your Size</h4>
                      <button 
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="text-gray-600 hover:text-black underline text-sm"
                      >
                        View Size Guide
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {productData.sizeGuide.map((sizeInfo) => (
                        <motion.button
                          key={sizeInfo.size}
                          onClick={() => setSelectedSize(sizeInfo.size)}
                          className={`py-3 px-4 border-2 rounded-lg text-center font-medium transition-all ${
                            selectedSize === sizeInfo.size
                              ? 'border-black bg-black text-white'
                              : 'border-gray-400 hover:border-gray-600 text-black'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {sizeInfo.size}
                        </motion.button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {showSizeGuide && (
                        <motion.div 
                          className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-lg font-semibold text-black">Size Guide</h5>
                            <div className="flex bg-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => setSizeUnit('inches')}
                                className={`px-3 py-1 text-xs transition-colors ${
                                  sizeUnit === 'inches' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
                                }`}
                              >
                                Inches
                              </button>
                              <button
                                onClick={() => setSizeUnit('cm')}
                                className={`px-3 py-1 text-xs transition-colors ${
                                  sizeUnit === 'cm' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
                                }`}
                              >
                                CM
                              </button>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-gray-300">
                                  <th className="text-left py-2 text-black">Size</th>
                                  <th className="text-left py-2 text-black">Length</th>
                                  <th className="text-left py-2 text-black">Chest</th>
                                  <th className="text-left py-2 text-black">Sleeve</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productData.sizeGuide.map((size) => (
                                  <tr key={size.size} className="border-b border-gray-200">
                                    <td className="py-2 font-medium text-black">{size.size}</td>
                                    <td className="py-2 text-gray-700">
                                      {sizeUnit === 'inches' ? size.length : `${size.lengthCm} cm`}
                                    </td>
                                    <td className="py-2 text-gray-700">
                                      {sizeUnit === 'inches' ? size.chest : `${size.chestCm} cm`}
                                    </td>
                                    <td className="py-2 text-gray-700">
                                      {sizeUnit === 'inches' ? size.sleeve : `${size.sleeveCm} cm`}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-black">Quantity:</span>
                      <div className="flex items-center border border-gray-400 rounded-lg">
                        <motion.button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors text-black"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <span className="px-6 py-2 border-x border-gray-400 min-w-[3rem] text-center text-black">{quantity}</span>
                        <motion.button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-4 py-2 hover:bg-gray-100 transition-colors text-black"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>

                    <motion.button 
                      className="w-full bg-black text-white py-4 text-lg font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!selectedSize}
                      whileHover={{ scale: selectedSize ? 1.02 : 1 }}
                      whileTap={{ scale: selectedSize ? 0.98 : 1 }}
                    >
                      ADD TO CART - {productData.price}
                    </motion.button>

                    {!selectedSize && (
                      <motion.p 
                        className="text-red-600 text-sm text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Please select a size
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Full-Width Back Design Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src={selectedColor.images.back}
            alt={`${productData.name} - Back Design`}
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
              The Message
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg max-w-3xl mx-auto">
&quot;ألآ تخافون من الله&quot; - A powerful rhetorical question that transcends fear, 
              inspiring reflection and spiritual accountability through authentic Arabic calligraphy.
            </p>
          </div>
        </div>
      </section>

      {/* Lifestyle Photography Sections */}
      {selectedColor.images.lifestyle.length > 0 && (
        <>
          {selectedColor.images.lifestyle.map((image, imageIndex) => (
            <section key={imageIndex} className="relative h-screen">
              <div className="absolute inset-0">
                <Image
                  src={image}
                  alt={`${productData.name} - Lifestyle ${imageIndex + 1}`}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-4xl px-6">
                  {imageIndex === 0 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
                        Modern Heritage
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto">
                        Where tradition meets contemporary style. Designed in Los Angeles, 
                        rooted in authentic Arabic culture.
                      </p>
                    </>
                  )}
                  {imageIndex === 1 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
                        Crafted with Purpose
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto">
                        Premium heavyweight carded cotton with a boxy, oversized fit. 
                        Garment-dyed and pre-shrunk for lasting comfort.
                      </p>
                    </>
                  )}
                  {imageIndex === 2 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
                        Authentic Expression
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto">
                        Arabic calligraphy designed by first-generation and native speakers. 
                        Every detail honors the language and culture.
                      </p>
                    </>
                  )}
                  {imageIndex === 3 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-2xl">
                        Reclaiming the Narrative
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto">
                        Arabs are not what the world thinks they are—they are better. 
                        This design bridges heritage with hometown identity.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </section>
          ))}
        </>
      )}

      {/* Product Features Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-black font-bodoni">Craftsmanship Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productData.features.map((feature, index) => {
              const getIcon = (featureText: string) => {
                const lowerFeature = featureText.toLowerCase();
                
                // Unisex fit - Modern gender neutral person icon
                if (lowerFeature.includes('unisex')) {
                  return (
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  );
                }
                
                // Cotton/Material - Cotton plant flower icon
                if (lowerFeature.includes('cotton') || lowerFeature.includes('fabric')) {
                  return (
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c2.21 0 4 1.79 4 4 0 .89-.29 1.71-.78 2.38C16.33 8.75 17 9.8 17 11c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.2.67-2.25 1.78-2.62C10.29 7.71 10 6.89 10 6c0-2.21 1.79-4 2-4zm-5.5 7c1.93 0 3.5 1.57 3.5 3.5S8.43 16 6.5 16 3 14.43 3 12.5 4.57 9 6.5 9zm11 0c1.93 0 3.5 1.57 3.5 3.5S19.43 16 17.5 16 14 14.43 14 12.5 15.57 9 17.5 9zM12 16c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>
                    </svg>
                  );
                }
                
                // Arabic calligraphy/Cultural - Feather quill pen icon
                if (lowerFeature.includes('arabic') || lowerFeature.includes('calligraphy')) {
                  return (
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75"/>
                    </svg>
                  );
                }
                
                // Los Angeles/Location - City buildings skyline
                if (lowerFeature.includes('los angeles') || lowerFeature.includes('designed')) {
                  return (
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V7h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                    </svg>
                  );
                }
                
                // Garment-dyed/Process - Fabric with water droplet processing
                if (lowerFeature.includes('garment') || lowerFeature.includes('dyed') || lowerFeature.includes('shrunk')) {
                  return (
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9l-5.91 6.34L18 22l-6-3.27L6 22l1.91-6.66L2 9l6.91-.74L12 2z"/>
                      <circle cx="6" cy="6" r="2" opacity="0.7"/>
                      <circle cx="18" cy="6" r="2" opacity="0.7"/>
                      <circle cx="6" cy="18" r="2" opacity="0.7"/>
                      <circle cx="18" cy="18" r="2" opacity="0.7"/>
                    </svg>
                  );
                }
                
                // Fit/Style - Modern t-shirt silhouette
                if (lowerFeature.includes('fit') || lowerFeature.includes('oversized') || lowerFeature.includes('boxy') || 
                    lowerFeature.includes('shoulders') || lowerFeature.includes('neck') || lowerFeature.includes('ribbing')) {
                  return (
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4h1.5C18.33 4 19 4.67 19 5.5S18.33 7 17.5 7H16v13H8V7H6.5C5.67 7 5 6.33 5 5.5S5.67 4 6.5 4H8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z"/>
                    </svg>
                  );
                }
                
                // Label/Tag features - Enhanced tag icon
                if (lowerFeature.includes('label') || lowerFeature.includes('tear')) {
                  return (
                    <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
                    </svg>
                  );
                }
                
                // Default - star for premium quality
                return (
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              };
              
              return (
                <div key={index} className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    {getIcon(feature)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-black">{feature}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-black font-bodoni">Technical Specifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-black">Material & Construction</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium text-black">{productData.specifications.material}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-black">{productData.specifications.weight}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-300 pb-2">
                    <span className="text-gray-600">Fit:</span>
                    <span className="font-medium text-black">{productData.specifications.fit}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-black">Origin & Care</h3>
                <div className="space-y-4">
                  <div className="text-gray-700 mb-4">
                    <p className="leading-relaxed">{productData.specifications.origin}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-300">
                    <h4 className="font-semibold mb-3 text-black">Care Instructions:</h4>
                    <ul className="text-gray-600 space-y-2">
                      <li>• Machine wash cold with like colors</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low</li>
                      <li>• Iron inside out on low heat</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping & Returns */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-black font-bodoni">Our Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Free Shipping</h3>
              <p className="text-gray-600 text-lg">On orders over $50</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">30-Day Returns</h3>
              <p className="text-gray-600 text-lg">Easy returns & exchanges</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Premium Quality</h3>
              <p className="text-gray-600 text-lg">Crafted with care in the USA</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}