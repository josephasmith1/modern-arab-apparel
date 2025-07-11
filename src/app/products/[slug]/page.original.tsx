"use client";

import Image from 'next/image';
import { useState, use, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shirt, Feather, MapPin, Sparkles, PackageCheck, Droplets, Tag, Square, UserCircle } from "lucide-react";
import ColorThief from 'colorthief';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import AddToCartButton from '@/components/cart/AddToCartButton';
import comprehensiveProducts from '../../../../data/comprehensive-products.json';

interface ProductColor {
  name: string;
  hex: string;
  images: {
    main: string;
    back: string;
    lifestyle: string[];
  };
}

interface Product {
  slug: string;
  name: string;
  price: string;
  description: string;
  fullDescription: string;
  category: string;
  colors: ProductColor[];
  sizes: string[];
  features: string[];
  specifications: {
    material: string;
    weight: string;
    fit: string;
    origin: string;
  };
  sizeGuide: {
    size: string;
    length: string;
    chest: string;
    sleeve: string;
    lengthCm: string;
    chestCm: string;
    sleeveCm: string;
  }[];
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);

  // Get product data
  const productData = comprehensiveProducts.find((p) => p.slug === resolvedParams.slug) as Product | undefined;

  if (!productData) {
    notFound();
    return null; // This ensures TypeScript knows we exit here
  }

  const { addItem } = useCart();

  // State hooks
  const [selectedColor, setSelectedColor] = useState(productData.colors[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'inches' | 'cm'>('inches');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [imageBackgroundColors, setImageBackgroundColors] = useState<{ [key: string]: string }>({});
  const [extractedProductColors, setExtractedProductColors] = useState<{ [key: string]: string }>({});

  // Scroll tracking
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);

  // Genie effect - hero image transforms and fades as column image fades in
  const heroOpacity = useTransform(scrollY, [300, 800], [1, 0]);
  const heroScale = useTransform(scrollY, [300, 600], [1, 0.6]);
  const heroX = useTransform(scrollY, [300, 600], [0, 200]);
  const columnImageOpacity = useTransform(scrollY, [500, 700], [0, 1]);
  const columnImageScale = useTransform(scrollY, [500, 700], [0.8, 1]);

  // Color selector overlay opacity
  const colorSelectorOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const colorSelectorY = useTransform(scrollY, [0, 300], [0, 50]);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', updateScrollState);
    updateScrollState();

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  // Create comprehensive image gallery for selected color
  const currentImages = useMemo(() => {
    const images = [];
    if (selectedColor.images.main) images.push({ url: selectedColor.images.main, type: 'main' });
    if (selectedColor.images.back) images.push({ url: selectedColor.images.back, type: 'back' });
    if (selectedColor.images.lifestyle) {
      selectedColor.images.lifestyle.forEach((img: string, index: number) => {
        images.push({ url: img, type: `lifestyle-${index}` });
      });
    }
    return images;
  }, [selectedColor]);

  const nextImage = () => {
    setSelectedImageIndex((prevIndex: number) => 
      prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prevIndex: number) => 
      prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
    );
  };

  // Extract background color from image edges (not garment)
  const extractBackgroundColor = (imageSrc: string, callback: (color: string) => void) => {
    const img = document.createElement('img');
    // Remove crossOrigin for local images to avoid CORS issues
    // img.crossOrigin = 'anonymous';

    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      callback('rgb(240, 237, 236)'); // fallback to page background color
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          callback('rgb(240, 237, 236)');
          return;
        }

        // Scale down for performance
        const scale = Math.min(50 / img.width, 50 / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Get the exact background color from corners (most likely to be pure background)
        const corners = [
          { x: 0, y: 0 }, // top-left
          { x: canvas.width - 1, y: 0 }, // top-right
          { x: 0, y: canvas.height - 1 }, // bottom-left
          { x: canvas.width - 1, y: canvas.height - 1 }, // bottom-right
        ];

        // Get the most common color from corners
        const cornerColors = corners.map(({ x, y }) => {
          const index = (y * canvas.width + x) * 4;
          return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2]
          };
        });

        // Use the first corner's color as it's most likely to be the pure background
        const { r, g, b } = cornerColors[0];

        const rgbColor = `rgb(${r}, ${g}, ${b})`;
        callback(rgbColor);
      } catch (error) {
        console.error('Error extracting background color:', error);
        callback('rgb(240, 237, 236)'); // fallback to page background color
      }
    };
    img.onerror = () => {
      clearTimeout(timeout);
      // Silently fail and use page background color
      callback('rgb(240, 237, 236)'); // fallback to page background color
    };
    img.src = imageSrc;
  };

  // Extract dominant garment color from image using ColorThief
  const extractImageColor = (imageSrc: string, callback: (color: string) => void) => {
    const img = document.createElement('img');
    const colorThief = new ColorThief();

    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      callback('rgb(120, 120, 120)'); // fallback to gray
    }, 5000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        // Extract the dominant color
        const dominantColor = colorThief.getColor(img);
        const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
        console.log(`Extracted color for ${imageSrc}:`, rgbColor);
        callback(rgbColor);
      } catch (error) {
        console.error('Error extracting color with ColorThief:', error);
        // Try to get palette as fallback
        try {
          const palette = colorThief.getPalette(img, 5);
          if (palette && palette.length > 0) {
            // Find the most saturated color from palette (likely the garment color)
            let bestColor = palette[0];
            let maxSaturation = 0;

            for (const color of palette) {
              const [r, g, b] = color;
              const max = Math.max(r, g, b);
              const min = Math.min(r, g, b);
              const saturation = max === 0 ? 0 : (max - min) / max;

              if (saturation > maxSaturation) {
                maxSaturation = saturation;
                bestColor = color;
              }
            }

            const rgbColor = `rgb(${bestColor[0]}, ${bestColor[1]}, ${bestColor[2]})`;
            console.log(`Extracted color from palette for ${imageSrc}:`, rgbColor);
            callback(rgbColor);
          } else {
            callback('rgb(120, 120, 120)'); // fallback to gray
          }
        } catch (paletteError) {
          console.error('Error extracting color from palette:', paletteError);
          callback('rgb(120, 120, 120)'); // fallback to gray
        }
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      console.error('Error loading image for color extraction');
      callback('rgb(120, 120, 120)'); // fallback to gray
    };

    // Set crossOrigin for better compatibility
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
  };
  // Extract background colors for all lifestyle images and back image
  useEffect(() => {
    if (!selectedColor || !selectedColor.images) return;
    // Extract background colors for lifestyle images
    if (selectedColor.images.lifestyle && selectedColor.images.lifestyle.length > 0) {
      selectedColor.images.lifestyle.forEach((image: string, index: number) => {
        if (!imageBackgroundColors[image]) {
          setTimeout(() => {
            extractBackgroundColor(image, (color: string) => {
              setImageBackgroundColors((prev: { [key: string]: string }) => ({ ...prev, [image]: color }));
            });
          }, 200 + index * 100); // Stagger the requests
        }
      });
    }
    // Extract background color for back image
    if (selectedColor.images.back && !imageBackgroundColors[selectedColor.images.back]) {
      setTimeout(() => {
        extractBackgroundColor(selectedColor.images.back, (color: string) => {
          setImageBackgroundColors((prev: { [key: string]: string }) => ({ ...prev, [selectedColor.images.back]: color }));
        });
      }, 150);
    }
    // Extract background color for main image
    if (selectedColor.images.main && !imageBackgroundColors[selectedColor.images.main]) {
      setTimeout(() => {
        extractBackgroundColor(selectedColor.images.main, (color: string) => {
          setImageBackgroundColors((prev: { [key: string]: string }) => ({ ...prev, [selectedColor.images.main]: color }));
        });
      }, 100);
    }
  }, [selectedColor, imageBackgroundColors]);

  // Extract colors from main product images for accurate color swatches
  useEffect(() => {
    if (!productData || !productData.colors) return;
    console.log('Starting color extraction for', productData.colors.length, 'colors');
    productData.colors.forEach((color: any, index: number) => {
      if (color.images.main && !extractedProductColors[color.name]) {
        console.log(`Extracting color for ${color.name} from ${color.images.main}`);
        // Add a small delay to avoid overwhelming the browser
        setTimeout(() => {
          extractImageColor(color.images.main, (extractedColor: string) => {
            console.log(`Color extracted for ${color.name}:`, extractedColor);
            setExtractedProductColors((prev: { [key: string]: string }) => ({ ...prev, [color.name]: extractedColor }));
          });
        }, 100 + index * 200);
      }
    });
  }, [productData, extractedProductColors]);

  // Reset image index when color changes
  useEffect(() => {
    console.log('Selected color changed to:', selectedColor.name);
    console.log('Current images for this color:', currentImages);
    setSelectedImageIndex(0);
  }, [selectedColor.name, currentImages]);

  return (
    <div className="text-black font-montserrat" style={{ backgroundColor: '#f0edec' }}>
      {/* Hero Image */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-screen z-5 overflow-hidden"
        style={{ 
          opacity: heroOpacity,
          scale: heroScale,
          x: heroX,
        }}
      >
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedColor.name}-${selectedImageIndex}`}
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
                sizes="100vw"
                className="object-cover object-center"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Navigation Arrows */}
        {currentImages.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all z-20"
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
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-20">
            {selectedImageIndex + 1} / {currentImages.length}
          </div>
        )}
      </motion.div>

      {/* Color Selector Overlay - Fixed on Hero */}
      <motion.div 
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20"
        style={{ 
          opacity: colorSelectorOpacity,
          y: colorSelectorY 
        }}
      >
        <div className="bg-black/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div className="text-center mb-4">
            <h3 className="text-white font-semibold text-lg">Choose Your Color</h3>
            <p className="text-gray-200 text-sm">{selectedColor.name}</p>
          </div>

          <div className="flex justify-center space-x-4">
            {productData.colors.map((color) => (
              <motion.button
                key={color.name}
                onClick={() => {
                  console.log('Color swatch clicked:', color.name);
                  setSelectedColor(color);
                  setSelectedImageIndex(0); // Always reset to first image for new color
                  // Extract color if not already done
                  if (!extractedProductColors[color.name]) {
                    extractImageColor(color.images.main, (extractedColor) => {
                      setExtractedProductColors(prev => ({ ...prev, [color.name]: extractedColor }));
                    });
                  }
                }}
                className={`relative w-12 h-12 rounded-full border-4 transition-all ${
                  selectedColor.name === color.name 
                    ? 'border-white shadow-lg scale-110' 
                    : 'border-gray-400 hover:border-gray-200'
                }`}
                whileHover={{ scale: selectedColor.name === color.name ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span 
                  className="absolute inset-1 rounded-full"
                  style={{ backgroundColor: extractedProductColors[color.name] || color.hex }}
                  title={`${color.name}: ${extractedProductColors[color.name] || color.hex}`}
                />
                {/* Loading indicator for color extraction */}
                {!extractedProductColors[color.name] && (
                  <span className="absolute inset-1 rounded-full bg-gray-300 animate-pulse" />
                )}
                <span className="sr-only">{color.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Hero Text Overlay - Fixed Position */}
      <motion.div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        style={{ 
          opacity: colorSelectorOpacity,
          y: contentY,
          zIndex: 15
        }}
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
          <motion.button          className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-2xl pointer-events-auto"
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
              className={`space-y-8 ${isScrolled ? 'lg:sticky lg:top-24' : ''}`}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-10">
                <h2 className="text-2xl md:text-3xl font-normal mb-6 text-gray-900 font-bodoni">
                  A Statement of Heritage
                </h2>
                <div className="space-y-8 text-gray-700">
                  <p className="text-lg md:text-xl leading-loose font-normal font-barlow-condensed">{productData.description}</p>
                  <p className="text-base md:text-lg leading-loose font-normal text-gray-600 font-barlow-condensed">{productData.fullDescription}</p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-8 mt-16">
                <h3 className="text-lg font-normal text-gray-900 font-bodoni">Key Features</h3>
                <ul className="space-y-3">
                  {productData.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center text-gray-700 font-barlow-condensed"
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
              className={`space-y-8 ${isScrolled ? 'lg:sticky lg:top-24' : ''}`}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Product Image in Column */}
              <motion.div 
                className="rounded-lg shadow-xl overflow-hidden"
                style={{ 
                  opacity: columnImageOpacity,
                  scale: columnImageScale,
                  backgroundColor: imageBackgroundColors[currentImages[selectedImageIndex]?.url] || imageBackgroundColors[selectedColor.images.main] || 'rgb(255, 255, 255)',
                }}
              >
                <div className="relative h-96">
                  <Image
                    src={currentImages[selectedImageIndex]?.url || selectedColor.images.main}
                    alt={`${productData.name} - ${selectedColor.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain object-center"
                  />
                </div>
              </motion.div>

              {/* Thumbnail Gallery */}
              {currentImages.length > 1 && (<div className="flex justify-center gap-2 overflow-x-auto">
                  {currentImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-black' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image.url}
                        alt={`${productData.name} - View ${index + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover object-center"
                      />
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-lg shadow-xl p-4">
                <h3 className="text-lg font-bold mb-3 text-black font-bodoni">Customize Order</h3>

                {/* Selected Color - Clickable */}
                <div className="mb-3 relative">
                  <motion.div 
                    className="flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded p-1 -m-1"
                    onClick={() => setShowColorOptions(!showColorOptions)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xs font-medium text-gray-600">Color</span>
                    <div className="flex items-center space-x-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300 relative"
                        style={{ backgroundColor: extractedProductColors[selectedColor.name] || selectedColor.hex }}
                      >
                        {/* Loading indicator */}
                        {!extractedProductColors[selectedColor.name] && (
                          <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
                        )}
                      </div>
                      <span className="text-xs text-gray-700">{selectedColor.name}</span>
                      <motion.svg 
                        className="w-3 h-3 text-gray-400 ml-1"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: showColorOptions ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </motion.div>

                  {/* Color Options - Side Popup */}
                  <AnimatePresence>
                    {showColorOptions && (
                      <motion.div
                        className="absolute left-full ml-2 top-0 p-2 bg-white rounded-lg shadow-lg border z-50"
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        transition={{ 
                          type: "spring", 
                          duration: 0.4, 
                          bounce: 0.3 
                        }}
                      >
                        <div className="flex gap-1">
                          {productData.colors.map((color, index) => (
                            <motion.button
                              key={color.name}
                              onClick={() => {
                                console.log('Side color swatch clicked:', color.name);
                                setSelectedColor(color);
                                setShowColorOptions(false);
                                // Extract color if not already done
                                if (!extractedProductColors[color.name]) {
                                  extractImageColor(color.images.main, (extractedColor) => {setExtractedProductColors(prev => ({ ...prev, [color.name]: extractedColor }));
                                  });
                                }
                              }}
                              className={`w-7 h-7 rounded-full border-2 transition-all relative ${
                                selectedColor.name === color.name 
                                  ? 'border-black' 
                                  : 'border-gray-300 hover:border-gray-500'
                              }`}
                              style={{ backgroundColor: extractedProductColors[color.name] || color.hex }}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                delay: index * 0.05,
                                type: "spring",
                                duration: 0.3,
                                bounce: 0.4
                              }}
                              whileHover={{ scale: 1.1, y: -2 }}
                              whileTap={{ scale: 0.9 }}
                              title={color.name}
                            >
                              {/* Loading indicator */}
                              {!extractedProductColors[color.name] && (
                                <div className="absolute inset-0 rounded-full bg-gray-300 animate-pulse" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Size Selection - Compact */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Size</span>
                    <button 
                      onClick={() => setShowSizeGuide(!showSizeGuide)}
                      className="text-gray-400 hover:text-black text-xs"
                    >
                      Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {productData.sizeGuide.map((sizeInfo) => (
                      <motion.button
                        key={sizeInfo.size}
                        onClick={() => setSelectedSize(sizeInfo.size)}
                        className={`w-8 h-8 rounded-full border text-xs font-medium transition-all flex items-center justify-center ${
                          selectedSize === sizeInfo.size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 bg-white text-black hover:border-gray-400'
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
                                onClick={() => setSizeUnit('cm')}className={`px-3 py-1 text-xs transition-colors ${
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

                {/* Quantity - Inline */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-600">Qty</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <motion.button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 hover:bg-gray-100 transition-colors text-black text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      -
                    </motion.button>
                    <span className="px-3 py-1 border-x border-gray-300 text-center text-black text-xs min-w-[2rem]">{quantity}</span>
                    <motion.button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100 transition-colors text-black text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      +
                    </motion.button>
                  </div>
                </div>

                <AddToCartButton
                  onAddToCart={() => {
                    if (selectedSize) {
                      addItem({
                        id: `${productData.slug}-${selectedColor.name}-${selectedSize}`,
                        name: productData.name,
                        price: productData.price,
                        image: selectedColor.images.main,
                        color: selectedColor.name,
                        size: selectedSize
                      });
                    }
                  }}
                  disabled={!selectedSize}
                  price={productData.price}
                  className="rounded"
                />

                {!selectedSize && (
                  <motion.p 
                    className="text-red-500 text-xs text-center mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}transition={{ duration: 0.3 }}
                  >
                    Please select a size
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Magazine-Style Back Design Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={selectedColor.images.back}
            alt={`${productData.name} - Back Design`}
            fill
            sizes="100vw"
            className="object-contain object-left"
            style={{ backgroundColor: imageBackgroundColors[selectedColor.images.back] || 'rgb(0, 0, 0)' }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: imageBackgroundColors[selectedColor.images.back] 
                ? (() => {
                    const color = imageBackgroundColors[selectedColor.images.back];
                    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                    if (!rgbMatch) return 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)';

                    const [, r, g, b] = rgbMatch;
                    return `linear-gradient(to right, 
                      rgba(${r}, ${g}, ${b}, 0.1) 0%, 
                      rgba(${r}, ${g}, ${b}, 0.3) 30%, 
                      transparent 50%, 
                      rgba(${r}, ${g}, ${b}, 0.4) 70%, 
                      rgba(${r}, ${g}, ${b}, 0.8) 100%)`;
                  })()
                : 'linear-gradient(to right, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.6) 100%)'
            }}
          ></div>
        </div>

        {/* Magazine-style text block in lower right */}
        <div className="absolute bottom-16 right-8 md:bottom-20 md:right-16 max-w-md md:max-w-lg">
          <div className="bg-white/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl border-l-4 border-black">
            <div className="mb-4">
              <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">FEATURED DESIGN</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-black font-bodoni leading-tight">
              The Message
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
              &quot;ألآ تخافون من الله&quot; - A powerful rhetorical question that transcends fear, inspiring reflection and spiritual accountability through authentic Arabic calligraphy.
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-0.5 bg-black"></div>
              <span className="text-xs font-medium text-gray-600 tracking-wide">AUTHENTIC ARABIC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Magazine-Style Lifestyle Photography Sections */}
      {selectedColor.images.lifestyle.length > 0 && (
        <>
          {selectedColor.images.lifestyle.map((image, imageIndex) => {
            const contentData = [
              {
                category: "DESIGN PHILOSOPHY",
                title: "Modern Heritage",
                text: "Where tradition meets contemporary style. Designed in Los Angeles, rooted in authentic Arabic culture.",
                accent: "LOS ANGELES"
              },
              {
                category: "CRAFTSMANSHIP",
                title: "Crafted with Purpose",
                text: "Premium heavyweight carded cotton with a boxy, oversized fit. Garment-dyed and pre-shrunk for lasting comfort.",
                accent: "PREMIUM COTTON"
              },
              {
                category: "AUTHENTICITY",
                title: "Authentic Expression",
                text: "Arabic calligraphy designed by first-generation and native speakers. Every detail honors the language and culture.",
                accent: "CULTURAL RESPECT"
              },
              {
                category: "MISSION",
                title: "Reclaiming the Narrative",
                text: "Arabs are not what the world thinks they are—they are better. This design bridges heritage with hometown identity.",
                accent: "BREAKING STEREOTYPES"
              }
            ];

            const content = contentData[imageIndex] || contentData[0];const isEven = imageIndex % 2 === 0;

            // Get the background color for this image
            const backgroundColor = imageBackgroundColors[image] || 'rgb(0, 0, 0)';

            // Create gradient styles based on extracted background color
            const createGradientStyle = (color: string, isEven: boolean) => {
              // Parse RGB values
              const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
              if (!rgbMatch) return {};

              const [, r, g, b] = rgbMatch;
              const direction = isEven ? 'to right' : 'to left';

              return {
                background: `linear-gradient(${direction}, 
                  rgba(${r}, ${g}, ${b}, 0.1) 0%, 
                  rgba(${r}, ${g}, ${b}, 0.3) 30%, 
                  transparent 50%, 
                  rgba(${r}, ${g}, ${b}, 0.4) 70%, 
                  rgba(${r}, ${g}, ${b}, 0.8) 100%)`
              };
            };

            return (
              <section key={imageIndex} className="relative h-screen overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src={image}
                    alt={`${productData.name} - Lifestyle ${imageIndex + 1}`}
                    fill
                    sizes="100vw"
                    className={`object-contain ${isEven ? 'object-left' : 'object-right'}`}
                    style={{ backgroundColor: backgroundColor }}
                  />
                  <div 
                    className="absolute inset-0"
                    style={createGradientStyle(backgroundColor, isEven)}
                  ></div>
                </div>

                {/* Alternating magazine-style text blocks */}
                <div className={`absolute bottom-16 ${isEven ? 'right-8 md:right-16' : 'left-8 md:left-16'} max-w-md md:max-w-lg`}>
                  <motion.div 
                    className="bg-white/95 backdrop-blur-sm p-8 md:p-10 shadow-2xl border-l-4 border-black"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="mb-4">
                      <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">{content.category}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-light mb-4 text-black font-bodoni leading-tight">
                      {content.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                      {content.text}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-0.5 bg-black"></div>
                      <span className="text-xs font-medium text-gray-600 tracking-wide">{content.accent}</span>
                    </div>
                  </motion.div>
                </div>

                {/* Page number indicator */}
                <div className={`absolute top-8 ${isEven ? 'left-8' : 'right-8'}`}>
                  <div className="bg-black/70 text-white px-3 py-1 rounded text-sm font-medium">
                    0{imageIndex + 1}
                  </div>
                </div>
              </section>
            );
          })}
        </>
      )}

      {/* Product Features Section */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#f0edec' }}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black font-bodoni">Craftsmanship Details</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Every piece is thoughtfully designed with attention to detail and authentic cultural elements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productData.features.map((feature, index) => {
              const getIcon = (featureText: string) => {
                const lowerFeature = featureText.toLowerCase();

                // Unisex fit - UserCircle for all-gender wear
                if (lowerFeature.includes('unisex')) {
                  return <UserCircle className="w-8 h-8" strokeWidth={1} />;
                }

                // 100% premium carded cotton - Sparkles for premium cotton quality
                if (lowerFeature.includes('100%') || lowerFeature.includes('premium') || lowerFeature.includes('carded') || lowerFeature.includes('cotton')) {
                  return <Sparkles className="w-8 h-8" strokeWidth={1} />;
                }

                // Arabic calligraphy by native speakers - Feather for calligraphy/language
                if (lowerFeature.includes('arabic') || lowerFeature.includes('calligraphy') || lowerFeature.includes('first-generation') || lowerFeature.includes('native') || lowerFeature.includes('speakers')) {
                  return <Feather className="w-8 h-8" strokeWidth={1} />;
                }

                // Designed in Los Angeles - MapPin for location/origin
                if (lowerFeature.includes('los angeles') || lowerFeature.includes('designed')) {
                  return <MapPin className="w-8 h-8" strokeWidth={1} />;
                }

                // Garment-dyed, pre-shrunk fabric - Droplets for dyeing process
                if (lowerFeature.includes('garment') || lowerFeature.includes('dyed') || lowerFeature.includes('shrunk') || lowerFeature.includes('fabric')) {
                  return <Droplets className="w-8 h-8" strokeWidth={1} />;
                }

                // Boxy, oversized fit - Square for geometric wide fit
                if (lowerFeature.includes('boxy') || lowerFeature.includes('oversized')) {
                  return <Square className="w-8 h-8" strokeWidth={1} />;
                }

                // Dropped shoulders - Shirt for garment structure
                if (lowerFeature.includes('dropped') || lowerFeature.includes('shoulders')) {
                  return <Shirt className="w-8 h-8" strokeWidth={1} />;
                }

                // Wide neck ribbing - Shirt for neckline/garment edge
                if (lowerFeature.includes('wide') || lowerFeature.includes('neck') || lowerFeature.includes('ribbing')) {
                  return <Shirt className="w-8 h-8" strokeWidth={1} />;
                }

                // Tear-away label - Tag for removable clothing tag
                if (lowerFeature.includes('tear') || lowerFeature.includes('label')) {
                  return <Tag className="w-8 h-8" strokeWidth={1} />;
                }

                // Default - PackageCheck for quality
                return <PackageCheck className="w-8 h-8" strokeWidth={1} />;
              };


              return (
                <motion.div 
                  key={index} 
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2 }}
                >
                  <div className="bg-white border border-gray-200 hover:border-black transition-all duration-300 p-8 text-left h-full relative">
                    {/* Icon container - minimalist */}
                    <div className="relative z-10 mb-6">
                      <motion.div 
                        className="w-16 h-16 border border-gray-300 group-hover:border-black rounded-full flex items-center justify-center transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="text-black group-hover:text-black transition-colors duration-300">
                          {getIcon(feature)}
                        </div>
                      </motion.div>
                    </div>

                    {/* Content */}<div className="relative z-10">
                      <h3 className="text-lg font-medium text-black group-hover:text-black transition-colors duration-300">
                        {feature}
                      </h3>

                      {/* Accent line */}
                      <div className="w-8 h-px bg-gray-300 group-hover:bg-black mt-3 transition-all duration-300"></div>
                    </div>
                  </div>
                </motion.div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
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
