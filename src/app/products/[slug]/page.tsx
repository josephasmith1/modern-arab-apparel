"use client";

import Image from 'next/image';
import { useState, useEffect, useMemo, useCallback, useRef, use } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
// import { Shirt, Feather, MapPin, Sparkles, PackageCheck, Droplets, Tag, Square, UserCircle } from "lucide-react";
import ColorThief from 'colorthief';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import AddToCartButton from '@/components/cart/AddToCartButton';
import { ProductColor, findProductBySlug } from '@/data/products/sync';

// Size guide interface used with compatibleProduct.sizeGuide
interface SizeGuideItem {
  size: string;
  length: string;
  chest: string;
  sleeve: string;
  lengthCm: string;
  chestCm: string;
  sleeveCm: string;
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params with React.use()
  const { slug } = use(params);
  
  // Get product data
  const productData = findProductBySlug(slug);

  // Initialize hooks before any early returns
  const { addItem } = useCart();

  // Fallback colors for when extraction fails or data.ts has empty hex values
  const getFallbackColor = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Faded Bone': '#E8E4E0',
      'Faded Green': '#A4B5A0', 
      'Faded Khaki': '#C4A575',
      'Faded  Khaki': '#C4A575', // Handle double space in data
      'Faded Black': '#4A4A4A',
      'Faded Sand': '#D4C4A8',
      'Faded Eucalyptus': '#A4B5A0', // Same as Faded Green
    };
    return colorMap[colorName] || '#8B7355'; // Default brown fallback
  };

  // Create compatibility layer for missing fields - handle case when productData is null
  // Use useMemo to prevent unnecessary re-renders
  const compatibleProduct = useMemo(() => productData ? {
    ...productData,
    colors: productData.colors.map(color => ({
      ...color,
      hex: color.hex || getFallbackColor(color.name) // Use fallback if hex is empty
    })),
    description: productData.description && typeof productData.description === 'object' ? {
      short: (productData.description as { short?: string; inspiration?: string; features?: string[]; perfectFor?: string[]; additionalSpecs?: string[]; fullDescription?: string }).short || "",
      inspiration: (productData.description as { short?: string; inspiration?: string; features?: string[]; perfectFor?: string[]; additionalSpecs?: string[]; fullDescription?: string }).inspiration || "Crafted to embody Modern Arab's vision of redefining Arabic fashion.",
      features: (productData.description as { short?: string; inspiration?: string; features?: string[]; perfectFor?: string[]; additionalSpecs?: string[]; fullDescription?: string }).features || [],
      perfectFor: (productData.description as { short?: string; inspiration?: string; features?: string[]; perfectFor?: string[]; additionalSpecs?: string[]; fullDescription?: string }).perfectFor || [],
      additionalSpecs: (productData.description as { short?: string; inspiration?: string; features?: string[]; perfectFor?: string[]; additionalSpecs?: string[]; fullDescription?: string }).additionalSpecs || [],
      fullDescription: (productData.description as { short?: string; inspiration?: string; features?: string[]; perfectFor?: string[]; additionalSpecs?: string[]; fullDescription?: string }).fullDescription || ""
    } : {
      short: typeof productData.description === 'string' ? productData.description.replace(/<[^>]+>/g, '').trim() : "",
      inspiration: "Crafted to embody Modern Arab's vision of redefining Arabic fashion.",
      features: [],
      perfectFor: [],
      additionalSpecs: [],
      fullDescription: productData.fullDescription || productData.description || ""
    },
    sizeGuide: [
      { size: "S", length: "27¾\"", chest: "39\"", sleeve: "9\"", lengthCm: "70.5", chestCm: "99", sleeveCm: "23" },
      { size: "M", length: "29⅛\"", chest: "43\"", sleeve: "9½\"", lengthCm: "74", chestCm: "109.2", sleeveCm: "24" },
      { size: "L", length: "30½\"", chest: "47\"", sleeve: "9½\"", lengthCm: "77.5", chestCm: "119.4", sleeveCm: "24" },
      { size: "XL", length: "31⅞\"", chest: "51\"", sleeve: "10¼\"", lengthCm: "81", chestCm: "129.5", sleeveCm: "26" },
      { size: "2XL", length: "33¼\"", chest: "55\"", sleeve: "10⅝\"", lengthCm: "84.5", chestCm: "139.7", sleeveCm: "27" },
      { size: "3XL", length: "34\"", chest: "59\"", sleeve: "11\"", lengthCm: "86.5", chestCm: "149.9", sleeveCm: "28" }
    ] as SizeGuideItem[],
    specifications: productData.specifications && typeof productData.specifications === 'object' ? {
      material: (productData.specifications as { material?: string; weight?: string; fit?: string; origin?: string }).material || "100% premium cotton",
      weight: (productData.specifications as { material?: string; weight?: string; fit?: string; origin?: string }).weight || "Medium weight",
      fit: (productData.specifications as { material?: string; weight?: string; fit?: string; origin?: string }).fit || "Relaxed unisex fit",
      origin: (productData.specifications as { material?: string; weight?: string; fit?: string; origin?: string }).origin || "Designed in Los Angeles, USA"
    } : {
      material: "100% premium cotton",
      weight: "Medium weight",
      fit: "Relaxed unisex fit",
      origin: "Designed in Los Angeles, USA"
    }
  } : null, [productData]);

  // State hooks
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(compatibleProduct?.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'inches' | 'cm'>('inches');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [imageBackgroundColors, setImageBackgroundColors] = useState<{ [key: string]: string }>({});
  const [extractedProductColors, setExtractedProductColors] = useState<{ [key: string]: string; }>({});
  const fetchedColorsRef = useRef<{ [key: string]: boolean }>({});

  // Create a memoized array of all images for the selected color
  const currentImages = useMemo(() => {
    if (!selectedColor || !selectedColor.images) return [];
    const { main, back, lifestyle } = selectedColor.images;
    const images = [];
    if (main) images.push(main);
    if (back) images.push(back);
    if (lifestyle && lifestyle.length > 0) images.push(...lifestyle);
    return images.filter(Boolean); // Filter out any empty strings
  }, [selectedColor]);

  // Create a separate array for thumbnails with lifestyle images first
  const thumbnailImages = useMemo(() => {
    if (!selectedColor || !selectedColor.images) return [];
    const { main, back, lifestyle } = selectedColor.images;
    const images = [];
    // Put lifestyle images first for thumbnails
    if (lifestyle && lifestyle.length > 0) images.push(...lifestyle);
    if (main) images.push(main);
    if (back) images.push(back);
    return images.filter(Boolean); // Filter out any empty strings
  }, [selectedColor]);

  // Initialize and reset selected image index - always start with main product image (index 0)
  useEffect(() => {
    if (selectedColor && selectedColor.images && currentImages.length > 0) {
      // Always start with the first image (main product image)
      setSelectedImageIndex(0);
    }
  }, [selectedColor, currentImages]);

  // Extract dominant garment color using server-side API to avoid CORS issues
  const extractImageColor = useCallback(async (imageSrc: string, callback: (color: string) => void) => {
    try {
      console.log('Extracting color for:', imageSrc);
      
      // Use server-side API for all images (both external and local)
      const response = await fetch('/api/extract-color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: imageSrc }),
      });
      
      if (!response.ok) {
        console.error(`API responded with status: ${response.status}`);
        // Try again after a short delay
        setTimeout(async () => {
          try {
            const retryResponse = await fetch('/api/extract-color', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ imageUrl: imageSrc }),
            });
            
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              if (data.color) {
                console.log(`Color extracted on retry for ${imageSrc}:`, data.color);
                callback(data.color);
                return;
              }
            }
          } catch (retryError) {
            console.error('Retry failed:', retryError);
          }
          // Only use fallback if retry also fails
          const colorName = compatibleProduct?.colors.find(c => c.images.main === imageSrc)?.name || '';
          callback(getFallbackColor(colorName));
        }, 1000);
        return;
      }
      
      const data = await response.json();
      
      if (data.color) {
        console.log(`Color extracted for ${imageSrc}:`, data.color);
        callback(data.color);
      } else {
        throw new Error('No color returned from API');
      }
    } catch (error) {
      console.error('Color extraction failed:', error);
      // Fallback to a default color based on color name
      const colorName = compatibleProduct?.colors.find(c => c.images.main === imageSrc)?.name || '';
      callback(getFallbackColor(colorName));
    }
  }, [compatibleProduct?.colors]);

  // Extract colors for all product colors when component mounts or product changes
  useEffect(() => {
    if (!compatibleProduct?.colors) return;

    compatibleProduct.colors.forEach((color, index) => {
      if (color.images.main && !fetchedColorsRef.current[color.name]) {
        fetchedColorsRef.current[color.name] = true; // Mark as fetched
        console.log(`Extracting color for ${color.name} from ${color.images.main}`);
        const delay = index * 200; // Stagger API calls
        setTimeout(() => {
          extractImageColor(color.images.main, (extractedColor: string) => {
            console.log(`Color extracted for ${color.name}:`, extractedColor);
            setExtractedProductColors(prev => ({ ...prev, [color.name]: extractedColor }));
          });
        }, delay);
      }
    });
  }, [compatibleProduct?.colors, extractImageColor, fetchedColorsRef]);

  
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
  const extractBackgroundColor = useCallback(async (imageSrc: string, callback: (color: string) => void) => {
    try {
      console.log('Extracting background color for:', imageSrc);
      
      // Use server-side API for all images (both external and local) to avoid CORS
      const response = await fetch('/api/extract-color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: imageSrc,
          extractBackground: true // Add flag to extract background instead of dominant color
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.color) {
        console.log(`Background color extracted for ${imageSrc}:`, data.color);
        callback(data.color);
      } else {
        throw new Error('No color returned from API');
      }
    } catch (error) {
      console.error('Background color extraction failed:', error);
      // Fallback to page background color
      callback('rgb(240, 237, 236)');
    }
  }, []);


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
  }, [selectedColor, imageBackgroundColors, extractBackgroundColor]);


  // Reset image index when color changes
  useEffect(() => {
    if (selectedColor) {
      console.log('Selected color changed to:', selectedColor.name);
      console.log('Current images for this color:', currentImages);
      setSelectedImageIndex(0);
    }
  }, [selectedColor, currentImages]);

  // Early return after all hooks are initialized
  if (!productData || !compatibleProduct) {
    notFound();
  }

  // Ensure we have a selected color
  if (!selectedColor) {
    return <div>Loading...</div>;
  }

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
              key={`${selectedColor?.name || 'default'}-${selectedImageIndex}`}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full h-full"
            >
              <Image
                src={currentImages[selectedImageIndex] || selectedColor?.images?.main || '/images/placeholder.jpg'}
                alt={`${compatibleProduct.name} - ${selectedColor.name}`}
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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

      </motion.div>

      {/* Color Selector Overlay - Fixed on Hero - Only show if more than one color */}
      {compatibleProduct.colors.length > 1 && (
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
              {compatibleProduct.colors.map((color) => (
              <motion.button
                key={color.name}
                onClick={() => {
                  console.log('Color swatch clicked:', color.name);
                  console.log('Color images:', color.images);
                  setSelectedColor(color);
                  // Don't manually set selectedImageIndex here - let the useEffect handle it
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
      )}
        
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
            {compatibleProduct.name}
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {compatibleProduct.price}
          </motion.p>
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
                  <div className="text-lg md:text-xl leading-loose font-normal font-barlow-condensed">
                  {(() => {
                    // Extract just the main description paragraph from the HTML
                    const htmlContent = compatibleProduct.fullDescription || compatibleProduct.description || '';
                    
                    // Use regex to extract the first paragraph that's not a special section
                    if (typeof htmlContent === 'string') {
                      const match = htmlContent.match(/<p>(?!.*<strong>)(?!.*•)(?!.*Disclaimer:)([^<]+(?:<[^>]+>[^<]+)*)<\/p>/);
                      if (match && match[1]) {
                        // Create a temporary element to strip HTML tags properly
                        if (typeof window !== 'undefined') {
                          const tempDiv = document.createElement('div');
                          tempDiv.innerHTML = match[1];
                          return tempDiv.textContent || '';
                        } else {
                          // Server-side: strip basic HTML tags
                          return match[1].replace(/<[^>]+>/g, '');
                        }
                      }
                      
                      // Fallback: strip HTML tags from the content
                      const strippedContent = htmlContent.replace(/<[^>]+>/g, '').trim();
                      // Show first 500 characters or first few sentences
                      const sentences = strippedContent.match(/[^.!?]+[.!?]+/g) || [];
                      const firstFewSentences = sentences.slice(0, 3).join(' ');
                      return firstFewSentences || strippedContent.substring(0, 500) + '...';
                    }
                    
                    return 'Experience premium quality and cultural pride with this thoughtfully designed piece.';
                  })()}
                </div>
                </div>
              </div>
              
              {/* Quick Features - Extract from HTML */}
              <div className="space-y-6 mt-16">
                <h3 className="text-lg font-normal text-gray-900 font-bodoni">Quick Features</h3>
                <ul className="space-y-3">
                  {(() => {
                    const htmlContent = compatibleProduct.fullDescription || '';
                    const features: string[] = [];
                    
                    // Use regex to find the first UL element after Features section
                    const ulMatch = htmlContent.match(/<ul>([^<]+(?:<li>[^<]+<\/li>[^<]+)*)<\/ul>/);
                    if (ulMatch) {
                      // Extract LI elements
                      const liMatches = ulMatch[1].matchAll(/<li>([^<]+)<\/li>/g);
                      for (const match of liMatches) {
                        const text = match[1].trim();
                        // Skip technical specs and size guides
                        if (!text.includes('oz.') && !text.includes('cm') && !text.includes('inches') && 
                            !text.includes('Blank product') && !text.includes('Model wears') && 
                            text.length < 100) {
                          features.push(text);
                        }
                      }
                    }
                    
                    // If no UL found, try to extract from Features paragraph with bullet points
                    if (features.length === 0) {
                      const featuresMatch = htmlContent.match(/<strong>Features:<\/strong><br[^>]*>([^<]+(?:<br[^>]*>[^<]+)*)/);
                      if (featuresMatch) {
                        const items = featuresMatch[1].split(/•/).filter(item => item.trim());
                        items.forEach(item => {
                          const text = item.replace(/<[^>]+>/g, '').trim();
                          if (text && text.length < 100) {
                            features.push(text);
                          }
                        });
                      }
                    }
                    
                    // Limit to 5 features for quick view
                    return features.length > 0 ? features.slice(0, 5).map((feature, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-center text-gray-700 font-barlow-condensed"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 bg-black"></div>
                        {feature}
                      </motion.li>
                    )) : (
                      <motion.li 
                        className="text-gray-600 italic font-barlow-condensed"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                      >
                        See product details below for more information
                      </motion.li>
                    );
                  })()}
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
                className="rounded-lg shadow-xl overflow-hidden relative"
                style={{ 
                  opacity: columnImageOpacity,
                  scale: columnImageScale,
                  backgroundColor: imageBackgroundColors[currentImages[selectedImageIndex]] || imageBackgroundColors[selectedColor.images.main] || 'rgb(255, 255, 255)',
                }}
              >
                <div className="relative h-96">
                  <Image
                    src={currentImages[selectedImageIndex] || selectedColor?.images?.main || '/images/placeholder.jpg'}
                    alt={`${compatibleProduct.name} - ${selectedColor.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain object-center"
                  />
                </div>
              </motion.div>

              {/* Thumbnail Gallery */}
              {thumbnailImages.length > 1 && (
                <div className="flex justify-center gap-2 overflow-x-auto">
                  {thumbnailImages.map((image, thumbnailIndex) => {
                    // Find the actual index of this image in currentImages
                    const actualIndex = currentImages.indexOf(image);
                    return (
                      <motion.button
                        key={thumbnailIndex}
                        onClick={() => setSelectedImageIndex(actualIndex)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === actualIndex 
                            ? 'border-black' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={image}
                          alt={`${compatibleProduct.name} - View ${thumbnailIndex + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover object-center"
                        />
                      </motion.button>
                    );
                  })}
                </div>
              )}

              <div className="bg-white rounded-lg shadow-xl p-4">
                <h3 className="text-lg font-bold mb-3 text-black font-bodoni">Customize Order</h3>
                
                {/* Selected Color - Only show if more than one color */}
                {compatibleProduct.colors.length > 1 ? (
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7-7 7-7" />
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
                            {compatibleProduct.colors.map((color) => (
                              <motion.button
                                key={color.name}
                                onClick={() => {
                                  setSelectedColor(color);
                                  setShowColorOptions(false);
                                }}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  selectedColor?.name === color.name 
                                    ? 'border-black scale-110' 
                                    : 'border-gray-300 hover:border-gray-500'
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ backgroundColor: extractedProductColors[color.name] || color.hex || getFallbackColor(color.name) }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                ) : (
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Color</span>
                      <div className="flex items-center space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: extractedProductColors[selectedColor.name] || selectedColor.hex }}
                        />
                        <span className="text-xs text-gray-700">{selectedColor.name}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-600">Size</span>
                    <button 
                      onClick={() => setShowSizeGuide(true)}
                      className="text-xs text-gray-500 hover:text-black underline"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {compatibleProduct?.sizes?.map((size) => (
                      <motion.button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-full text-xs font-medium border transition-all ${
                          selectedSize === size 
                            ? 'border-black bg-white text-black shadow-md' 
                            : 'border-gray-300 hover:border-gray-500 bg-white text-black'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
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
                    if (selectedSize && selectedColor && compatibleProduct) {
                      for (let i = 0; i < quantity; i++) {
                        addItem({
                          id: `${compatibleProduct.slug}-${selectedColor.name}-${selectedSize}`,
                          name: compatibleProduct.name,
                          price: compatibleProduct.price,
                          image: selectedColor.images.main,
                          color: selectedColor.name,
                          size: selectedSize
                        });
                      }
                    }
                  }}
                  disabled={!selectedSize}
                  price={compatibleProduct?.price || '0'}
                  className="rounded"
                />

                {!selectedSize && (
                  <motion.p 
                    className="text-red-500 text-xs text-center mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Please select a size
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Technical Specifications and Size Guide are now integrated into the magazine sections below */}

      {/* Magazine-Style Back Design Section */}
      {selectedColor.images.back && selectedColor.images.back.trim() !== '' && (
        <section className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={selectedColor.images.lifestyle?.[0] || selectedColor.images.back}
              alt={`${compatibleProduct.name} - Back Design`}
              fill
              sizes="100vw"
              className="object-contain object-left"
              style={{ backgroundColor: imageBackgroundColors[selectedColor.images.lifestyle?.[0] || selectedColor.images.back] || 'rgb(0, 0, 0)' }}
            />
          <div 
            className="absolute inset-0"
            style={{
              background: imageBackgroundColors[selectedColor.images.lifestyle?.[0] || selectedColor.images.back] 
                ? (() => {
                    const color = imageBackgroundColors[selectedColor.images.lifestyle?.[0] || selectedColor.images.back];
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
      )}

      {/* Magazine-Style Content Sections including Specs, Size Guide, and Lifestyle Photography */}
      {(() => {
        // Create an array of all content sections including specs and size guide
        type ContentSection = {
          type: 'specifications' | 'sizeguide';
          image: string;
          isFirst: boolean;
        } | {
          type: 'lifestyle';
          image: string;
          imageIndex: number;
          isFirst: boolean;
        };

        const allSections: ContentSection[] = [];
        
        // Add technical specifications as first section
        allSections.push({
          type: 'specifications',
          image: selectedColor.images.main, // Use main product image
          isFirst: true
        });
        
        // Add size guide as second section if product has sizes
        if (compatibleProduct.sizes && compatibleProduct.sizes.length > 0) {
          allSections.push({
            type: 'sizeguide',
            image: selectedColor.images.back || selectedColor.images.main, // Use back or main image
            isFirst: false
          });
        }
        
        // Add lifestyle images
        selectedColor.images.lifestyle.forEach((image, idx) => {
          allSections.push({
            type: 'lifestyle',
            image: image,
            imageIndex: idx,
            isFirst: false
          });
        });
        
        return allSections.length > 0 && (
        <>
          {allSections.map((section, sectionIndex) => {
            const imageIndex = section.type === 'lifestyle' ? section.imageIndex : sectionIndex;
            const image = section.image;
            // Extract maximum dynamic content from all available product data
            const extractDynamicContent = (index: number) => {
              const htmlContent = compatibleProduct.fullDescription || '';

              interface DynamicContent {
                category: string;
                title: string;
                text: string;
                accent: string;
                customContent?: React.ReactNode;
              }

              const contentData: DynamicContent[] = [];
              
              // Helper to clean HTML
              const cleanHtml = (text: string) => text.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
              
              // 1. Extract ALL features with creative categorization
              const featuresMatch = htmlContent.match(/<strong>Features:<\/strong>([\s\S]*?)(?=<strong>|<p><strong class=|$)/i);
              if (featuresMatch) {
                const allFeatures = featuresMatch[1].split(/•/).filter(f => cleanHtml(f).length > 10);
                allFeatures.forEach((feature, idx) => {
                  const cleanFeature = cleanHtml(feature);
                  let category = "FEATURES";
                  let title = "Premium Details";
                  let accent = "QUALITY FIRST";
                  
                  // Categorize features creatively based on content
                  if (cleanFeature.toLowerCase().includes('embroid') || cleanFeature.toLowerCase().includes('logo')) {
                    category = "BRANDING";
                    title = "Signature Elements";
                    accent = "ICONIC DESIGN";
                  } else if (cleanFeature.toLowerCase().includes('fit') || cleanFeature.toLowerCase().includes('size')) {
                    category = "FIT & COMFORT";
                    title = "Perfect Fit";
                    accent = "TAILORED FOR YOU";
                  } else if (cleanFeature.toLowerCase().includes('pocket') || cleanFeature.toLowerCase().includes('functional')) {
                    category = "FUNCTIONALITY";
                    title = "Smart Design";
                    accent = "PRACTICAL STYLE";
                  } else if (cleanFeature.toLowerCase().includes('fabric') || cleanFeature.toLowerCase().includes('material')) {
                    category = "MATERIALS";
                    title = "Premium Fabric";
                    accent = "QUALITY TEXTILES";
                  } else if (cleanFeature.toLowerCase().includes('cultural') || cleanFeature.toLowerCase().includes('arabic')) {
                    category = "HERITAGE";
                    title = "Cultural Essence";
                    accent = "AUTHENTIC ROOTS";
                  }
                  
                  contentData.push({
                    category,
                    title,
                    text: cleanFeature,
                    accent
                  });
                });
              }
              
              // 2. Extract design inspiration with multiple angles
              const inspirationMatch = htmlContent.match(/<strong>Design Inspiration:<\/strong>([\s\S]*?)(?=<strong>|<p><strong|$)/i);
              if (inspirationMatch) {
                const inspiration = cleanHtml(inspirationMatch[1]);
                // Split inspiration into multiple insights if it's long
                const sentences = inspiration.match(/[^.!?]+[.!?]+/g) || [inspiration];
                sentences.forEach((sentence, idx) => {
                  if (sentence.trim()) {
                    contentData.push({
                      category: idx === 0 ? "DESIGN STORY" : "INSPIRATION",
                      title: idx === 0 ? "The Vision" : "Creative Process",
                      text: sentence.trim(),
                      accent: idx === 0 ? "ARTIST'S INTENT" : "THOUGHTFUL DESIGN"
                    });
                  }
                });
              }
              
              // 3. Extract "Why Choose" section
              const whyMatch = htmlContent.match(/<strong>Why Choose[^<]*<\/strong>([\s\S]*?)(?=<strong>|<p><strong|$)/i);
              if (whyMatch) {
                const whyText = cleanHtml(whyMatch[1]);
                contentData.push({
                  category: "WHY US",
                  title: "The Difference",
                  text: whyText.substring(0, 200) + (whyText.length > 200 ? '...' : ''),
                  accent: "CHOOSE QUALITY"
                });
              }
              
              // 4. Extract Perfect For with each point as separate content
              const perfectMatch = htmlContent.match(/<strong>Perfect For:<\/strong>([\s\S]*?)(?=<strong>|<p><strong|$)/i);
              if (perfectMatch) {
                const perfectItems = perfectMatch[1].split(/•/).filter(f => cleanHtml(f).length > 10);
                perfectItems.forEach((item, idx) => {
                  contentData.push({
                    category: "LIFESTYLE",
                    title: idx === 0 ? "Made For You" : "Your Style",
                    text: cleanHtml(item),
                    accent: "PERFECT MATCH"
                  });
                });
              }
              
              // 5. Extract technical specifications creatively
              const specsMatches = htmlContent.match(/•\s*([^•]*\d+(?:%|oz|g\/m²|singles)[^•<]*)/gi);
              if (specsMatches) {
                specsMatches.forEach((spec, idx) => {
                  const cleanSpec = cleanHtml(spec);
                  if (cleanSpec && !cleanSpec.includes('Model wears')) {
                    contentData.push({
                      category: "SPECIFICATIONS",
                      title: "Technical Details",
                      text: cleanSpec,
                      accent: "PRECISION CRAFTED"
                    });
                  }
                });
              }
              
              // 6. Extract care instructions as lifestyle tips
              if (htmlContent.includes('Machine wash') || htmlContent.includes('wash')) {
                const washMatch = htmlContent.match(/(?:Machine wash[^<.]*|Hand wash[^<.]*)/i);
                if (washMatch) {
                  contentData.push({
                    category: "CARE GUIDE",
                    title: "Easy Maintenance",
                    text: "Designed for real life - " + washMatch[0] + ". Built to last through countless wears and washes.",
                    accent: "HASSLE-FREE"
                  });
                }
              }
              
              // 7. Extract origin and production info
              const originMatches = [
                htmlContent.match(/Designed (?:in|and)[^<.]+/i),
                htmlContent.match(/(?:Blank product )?sourced from[^<.]+/i),
                htmlContent.match(/Final product[^<.]+/i)
              ];
              originMatches.forEach((match, idx) => {
                if (match) {
                  const categories = ["ORIGIN STORY", "PRODUCTION", "CRAFTED WITH CARE"];
                  const titles = ["Where It Begins", "Global Sourcing", "Final Touch"];
                  contentData.push({
                    category: categories[idx],
                    title: titles[idx],
                    text: cleanHtml(match[0]),
                    accent: "QUALITY JOURNEY"
                  });
                }
              });
              
              // 8. Create content from product tags
              if (compatibleProduct.tags && compatibleProduct.tags.length > 0) {
                const tagGroups = {
                  style: compatibleProduct.tags.filter(t => ['Streetwear', 'Minimalist', 'Modern', 'Premium'].includes(t)),
                  demographic: compatibleProduct.tags.filter(t => ['Men', 'Women', 'Unisex'].includes(t)),
                  cultural: compatibleProduct.tags.filter(t => ['Arabic', 'Western Apparel'].includes(t)),
                  product: compatibleProduct.tags.filter(t => ['Hoodie', 'Tee', 'Sweatpants', 'Cap', 'Beanie'].includes(t))
                };
                
                if (tagGroups.style.length > 0) {
                  contentData.push({
                    category: "STYLE PROFILE",
                    title: tagGroups.style[0] + " Aesthetic",
                    text: `Embodying ${tagGroups.style.join(' and ').toLowerCase()} design principles, this piece represents the evolution of contemporary fashion.`,
                    accent: "STYLE DEFINED"
                  });
                }
                
                if (tagGroups.demographic.length > 1) {
                  contentData.push({
                    category: "INCLUSIVE DESIGN",
                    title: "For Everyone",
                    text: `Thoughtfully designed to be truly ${tagGroups.demographic.join(' and ').toLowerCase()}, breaking boundaries in fashion.`,
                    accent: "NO LIMITS"
                  });
                }
              }
              
              // 9. Extract pricing philosophy if there's a sale
              if (compatibleProduct.originalPrice && compatibleProduct.originalPrice !== compatibleProduct.price) {
                contentData.push({
                  category: "VALUE",
                  title: "Investment Piece",
                  text: "Premium quality at an accessible price point. True value that goes beyond the price tag.",
                  accent: "SMART CHOICE"
                });
              }
              
              // 10. Create seasonal/contextual content based on product type
              const productType = compatibleProduct.collection?.toLowerCase() || '';
              if (productType.includes('layer') || productType.includes('hoodie')) {
                contentData.push({
                  category: "VERSATILITY",
                  title: "Year-Round Essential",
                  text: "From cool morning runs to late night sessions, this piece adapts to your life and climate.",
                  accent: "ALL SEASONS"
                });
              } else if (productType.includes('headwear')) {
                contentData.push({
                  category: "ACCESSORIES",
                  title: "Complete The Look",
                  text: "The perfect finishing touch that elevates any outfit while making a subtle statement.",
                  accent: "STYLE ESSENTIAL"
                });
              }
              
              // 11. Add product-specific insights based on name
              if (compatibleProduct.name.toLowerCase().includes('faded')) {
                contentData.push({
                  category: "AESTHETIC",
                  title: "Vintage Appeal",
                  text: "Pre-faded for that perfectly worn-in look. Each piece tells its own story from day one.",
                  accent: "TIMELESS STYLE"
                });
              }
              
              // 12. Mission-driven content
              if (htmlContent.includes('Arabs are not what')) {
                const missionMatch = htmlContent.match(/Arabs are not[^.]+\./i);
                if (missionMatch) {
                  contentData.push({
                    category: "OUR MISSION",
                    title: "Changing Narratives",
                    text: cleanHtml(missionMatch[0]),
                    accent: "REDEFINING CULTURE"
                  });
                }
              }
              
              // Remove duplicates based on text similarity
              const uniqueContent: DynamicContent[] = [];
              const seenTexts = new Set();
              contentData.forEach(item => {
                const textKey = item.text.toLowerCase().substring(0, 50);
                if (!seenTexts.has(textKey)) {
                  seenTexts.add(textKey);
                  uniqueContent.push(item);
                }
              });
              
              // If we have more content than images, great! If not, we'll cycle through
              return uniqueContent[index % uniqueContent.length] || {
                category: "MODERN ARAB",
                title: "Timeless Design",
                text: "Where heritage meets contemporary style, creating pieces that transcend trends.",
                accent: "AUTHENTIC STYLE"
              };
            };
            
            const isEven = sectionIndex % 2 === 0;
            
            // Get content based on section type
            let content;
            if (section.type === 'specifications') {
              // Extract technical specifications
              const specs = extractTechnicalSpecs(compatibleProduct.fullDescription || '');
              content = {
                category: "TECHNICAL DETAILS",
                title: "Premium Specifications",
                text: specs.length > 0 ? specs.join(' • ') : "Crafted with the finest materials and attention to detail.",
                accent: "QUALITY ASSURED",
                customContent: renderSpecificationsGrid(specs)
              };
            } else if (section.type === 'sizeguide') {
              content = {
                category: "FIT GUIDE",
                title: "Find Your Perfect Size",
                text: extractDisclaimer(compatibleProduct.fullDescription || '') || "Designed for a comfortable, true-to-size fit. When in doubt, size up for a relaxed look.",
                accent: "SIZE MATTERS",
                customContent: renderSizeGuide()
              };
            } else {
              content = extractDynamicContent(imageIndex);
            }
            
            // Helper function to extract disclaimer
            function extractDisclaimer(html: string): string {
              const disclaimerMatch = html.match(/(?:Disclaimer:|Note:)([^<]+)/i);
              if (disclaimerMatch) {
                return disclaimerMatch[1].trim();
              }
              
              // Look for sizing notes
              const sizeMatch = html.match(/(?:runs? (?:small|large|big)|recommend ordering|size up|size down)([^<.]*)/i);
              if (sizeMatch) {
                return sizeMatch[0].trim();
              }
              
              return '';
            }
            
            // Helper function to extract technical specs
            function extractTechnicalSpecs(html: string): string[] {
              const specs: string[] = [];
              const cleanHtml = (text: string) => text.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
              
              // Find bullet points with technical info
              const matches = html.match(/•\s*([^•<]+(cotton|polyester|oz\.|weight|fit|sourced|printed)[^•<]*)/gi);
              if (matches) {
                matches.forEach(match => {
                  const clean = cleanHtml(match).replace(/^•\s*/, '');
                  if (clean && clean.length < 100 && !clean.includes('Model wears')) {
                    specs.push(clean);
                  }
                });
              }
              
              return specs.slice(0, 5); // Limit to 5 specs
            }
            
            // Helper function to render specifications grid
            function renderSpecificationsGrid(specs: string[]) {
              if (specs.length === 0) return null;
              
              return (
                <div className="mt-6 grid grid-cols-1 gap-3">
                  {specs.map((spec, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-black rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700 leading-relaxed">{spec}</p>
                    </div>
                  ))}
                </div>
              );
            }
            
            // Helper function to render size guide
            function renderSizeGuide() {
              if (!compatibleProduct) return null;
              // Extract size guide table from HTML
              const extractSizeTable = (html: string) => {
                // Look for the imperial table first
                const imperialMatch = html.match(/<div[^>]*data-unit-system="imperial"[^>]*>([\s\S]*?)<\/div>/i);
                if (imperialMatch) {
                  const tableMatch = imperialMatch[1].match(/<table[^>]*>([\s\S]*?)<\/table>/i);
                  if (tableMatch) {
                    return `<table class="w-full text-xs border-collapse">${tableMatch[1]}</table>`;
                  }
                }
                
                // Fallback to any table in the content
                const anyTableMatch = html.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
                if (anyTableMatch) {
                  return `<table class="w-full text-xs border-collapse">${anyTableMatch[1]}</table>`;
                }
                
                return null;
              };
              
              const sizeTableHtml = extractSizeTable(compatibleProduct.fullDescription || '');
              
              if (sizeTableHtml) {
                return (
                  <div className="mt-6 overflow-x-auto">
                    <h4 className="text-sm font-medium mb-3 text-gray-800">Size Chart (Inches)</h4>
                    <div 
                      className="size-table-content [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-300 [&>table>tbody>tr>td]:p-2 [&>table>tbody>tr>td]:text-center [&>table>tbody>tr:first-child>td]:bg-gray-100 [&>table>tbody>tr:first-child>td]:font-semibold [&>table>tbody>tr>td:first-child]:font-semibold [&>table>tbody>tr>td:first-child]:bg-gray-50"
                      dangerouslySetInnerHTML={{ __html: sizeTableHtml }}
                    />
                  </div>
                );
              }
              
              // Fallback to size bubbles if no table found
              const sizes = compatibleProduct.sizes || [];
              return (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <div 
                        key={size}
                        className="w-10 h-10 border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-medium"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic mt-2">
                    Available sizes - see product details for full measurements
                  </p>
                </div>
              );
            }
            
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
              <section key={sectionIndex} className="relative h-screen overflow-hidden">
                <div className="absolute inset-0">
                  <Image
                    src={image}
                    alt={`${compatibleProduct.name} - Lifestyle ${imageIndex + 1}`}
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
                
                {/* Alternating magazine-style text blocks with condensed layout after 8 sections */}
                <div className={`absolute ${sectionIndex >= 8 ? 'bottom-8' : 'bottom-16'} ${isEven ? 'right-8 md:right-16' : 'left-8 md:left-16'} ${sectionIndex >= 8 ? 'max-w-sm' : 'max-w-md md:max-w-lg'}`}>
                  <motion.div 
                    className={`bg-white/95 backdrop-blur-sm ${sectionIndex >= 8 ? 'p-6' : 'p-8 md:p-10'} shadow-2xl ${sectionIndex % 4 === 0 ? 'border-l-4 border-black' : sectionIndex % 4 === 1 ? 'border-t-4 border-black' : sectionIndex % 4 === 2 ? 'border-r-4 border-black' : 'border-b-4 border-black'}`}
                    initial={{ opacity: 0, y: sectionIndex % 2 === 0 ? 50 : -50, x: sectionIndex % 2 === 0 ? 20 : -20 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring", damping: 20 }}
                    viewport={{ once: true }}
                  >
                    <div className="mb-4">
                      <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">{content.category}</span>
                    </div>
                    <h2 className={`${sectionIndex >= 8 ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'} font-light mb-4 text-black font-bodoni leading-tight`}>
                      {content.title}
                    </h2>
                    <p className={`${sectionIndex >= 8 ? 'text-sm md:text-base' : 'text-base md:text-lg'} text-gray-700 leading-relaxed ${sectionIndex >= 8 ? 'mb-4' : 'mb-6'}`}>
                      {sectionIndex >= 8 && content.text.length > 100 ? content.text.substring(0, 100) + '...' : content.text}
                    </p>
                    {content.customContent && content.customContent}
                    <div className="flex items-center space-x-3">
                      {sectionIndex % 3 === 0 && <div className="w-8 h-0.5 bg-black"></div>}
                      {sectionIndex % 3 === 1 && (
                        <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      )}
                      {sectionIndex % 3 === 2 && <div className="w-2 h-2 bg-black rounded-full"></div>}
                      <span className={`${sectionIndex >= 8 ? 'text-xs' : 'text-xs'} font-medium text-gray-600 tracking-wide`}>{content.accent}</span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Visual accent elements for variety */}
                {sectionIndex < 8 && (
                  <div className={`absolute ${sectionIndex % 3 === 0 ? 'top-8' : sectionIndex % 3 === 1 ? 'bottom-8' : 'top-1/2 -translate-y-1/2'} ${isEven ? 'left-8' : 'right-8'}`}>
                    {sectionIndex % 3 === 0 && (
                      <div className="w-20 h-0.5 bg-white/70"></div>
                    )}
                    {sectionIndex % 3 === 1 && (
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-white/70 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                      </div>
                    )}
                    {sectionIndex % 3 === 2 && (
                      <div className="w-12 h-12 border border-white/50 rounded-full"></div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </>
      );
      })()}



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
              <p className="text-lg text-gray-600">On orders over $50</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">30-Day Returns</h3>
              <p className="text-lg text-gray-600">Easy returns & exchanges</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Premium Quality</h3>
              <p className="text-lg text-gray-600">Crafted with care in the USA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {showSizeGuide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSizeGuide(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white p-8 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-semibold mb-6 text-black">Size Guide</h3>
              <div className="flex justify-center mb-6 border-b border-gray-300">
                <button 
                  className={`px-4 py-2 ${sizeUnit === 'inches' ? 'bg-gray-100 text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
                  onClick={() => setSizeUnit('inches')}
                >
                  Inches
                </button>
                <button 
                  className={`px-4 py-2 ${sizeUnit === 'cm' ? 'bg-gray-100 text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
                  onClick={() => setSizeUnit('cm')}
                >
                  Centimeters
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Size</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Length</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Chest</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compatibleProduct?.sizeGuide?.map((row: SizeGuideItem) => (
                      <tr key={row.size} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">{row.size}</td>
                        <td className="border border-gray-300 px-4 py-2">{sizeUnit === 'inches' ? row.length : row.lengthCm}</td>
                        <td className="border border-gray-300 px-4 py-2">{sizeUnit === 'inches' ? row.chest : row.chestCm}</td>
                        <td className="border border-gray-300 px-4 py-2">{sizeUnit === 'inches' ? row.sleeve : row.sleeveCm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                className="mt-6 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
                onClick={() => setShowSizeGuide(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}