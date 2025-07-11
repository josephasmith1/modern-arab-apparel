'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Feather, Star, MapPin } from 'lucide-react';
// import ColorThief from 'colorthief';
import comprehensiveProducts from '../../../data/comprehensive-products.json';
import { collections, getCollectionBySlug } from '../../data/collections';
import Footer from '@/components/Footer';

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [extractedProductColors, setExtractedProductColors] = useState<{ [key: string]: string }>({});

  // Extract dominant color from image using canvas
  const extractImageColor = (imageSrc: string, callback: (color: string) => void) => {
    const img = document.createElement('img');
    // Remove crossOrigin for local images to avoid CORS issues
    // img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          callback('rgb(0, 0, 0)');
          return;
        }
        
        // Scale down for performance
        const scale = Math.min(50 / img.width, 50 / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Get average color
        let r = 0, g = 0, b = 0;
        let pixelCount = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          pixelCount++;
        }
        
        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);
        
        const rgbColor = `rgb(${r}, ${g}, ${b})`;
        callback(rgbColor);
      } catch (error) {
        console.error('Error extracting color:', error);
        callback('rgb(0, 0, 0)'); // fallback to black
      }
    };
    img.onerror = () => {
      console.error('Error loading image for color extraction');
      callback('rgb(0, 0, 0)'); // fallback to black
    };
    img.src = imageSrc;
  };

  // Use comprehensive products
  const allProducts = comprehensiveProducts.map((p: any) => ({
    ...p,
    category: p.category || getCategoryFromName(p.name || '')
  }));

  // Function to determine category from product name
  function getCategoryFromName(name: string): string {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tee') || lowerName.includes('t-shirt')) return 'tees';
    if (lowerName.includes('hoodie') || lowerName.includes('sweatshirt')) return 'hoodies';
    if (lowerName.includes('beanie') || lowerName.includes('cap') || lowerName.includes('hat')) return 'headwear';
    if (lowerName.includes('pants') || lowerName.includes('sweatpants') || lowerName.includes('joggers')) return 'bottoms';
    return 'other';
  }

  // Function to get collection name from product
  function getProductCollection(product: any): string {
    const lowerName = product.name?.toLowerCase() || '';
    const lowerSlug = product.slug?.toLowerCase() || '';
    
    // Match based on product characteristics
    if (lowerName.includes('tee') || lowerName.includes('t-shirt')) return 'Tops';
    if (lowerName.includes('hoodie') || lowerName.includes('sweatshirt') || lowerName.includes('crewneck')) return 'Layers';
    if (lowerName.includes('cap') || lowerName.includes('beanie') || lowerName.includes('hat')) return 'Headwear';
    if (lowerName.includes('jogger') || lowerName.includes('sweatpants') || lowerName.includes('pants')) return 'Bottoms';
    
    // Fallback to checking against collection slugs
    const collection = collections.find(c => 
      lowerSlug.includes(c.slug.toLowerCase()) || 
      lowerName.includes(c.name.toLowerCase())
    );
    
    return collection?.name || 'Featured';
  }

  // Function to get correct image for each product
  function getProductImage(product: any): string {
    // If product has explicit image property (from productsJson)
    if ('image' in product && product.image) {
      return product.image;
    }
    
    // If product has colors array (from products data)
    if ('colors' in product && product.colors && product.colors.length > 0) {
      return product.colors[0].images.main;
    }
    
    // If product has selectedColor (expanded view)
    if ('selectedColor' in product && product.selectedColor) {
      return product.selectedColor.images.main;
    }
    
    // Fallback based on product slug to prevent all products showing same image
    const productSlug = product.slug || '';
    
    // Return specific fallback images based on product type - use first color from data
    if (productSlug.includes('hoodie')) return '/images/modern-arab-hoodie/bone-1.jpg';
    if (productSlug.includes('joggers')) return '/images/modern-arab-joggers/olive-green-1.jpg';
    if (productSlug.includes('sweatpants')) return '/images/modern-arab-sweatpants/light-green-1.jpg';
    if (productSlug.includes('crewneck')) return '/images/modern-arab-crewneck/black-1.jpg';
    if (productSlug.includes('cropped-hoodie')) return '/images/modern-arab-cropped-hoodie/black-1.jpg';
    if (productSlug.includes('cap')) return '/images/modern-arab-cap/black-1.jpg';
    if (productSlug.includes('bucket-hat')) return '/images/modern-arab-bucket-hat/black-1.jpg';
    if (productSlug.includes('beanie')) return '/images/modern-arab-beanie-black-1.jpg';
    
    // Default fallback for tees
    return '/images/modern-arab-faded-tee/faded-bone-1.jpg';
  }

  // Add category to products from data.ts
  const productsWithCategory = allProducts.map(product => ({
    ...product,
    category: product.category || getCategoryFromName(product.name || '')
  }));

  // Remove duplicates based on slug
  const uniqueProducts = productsWithCategory.filter((product, index, self) => 
    index === self.findIndex(p => p.slug === product.slug)
  );

  // Filter by category if specified (case-insensitive)
  let filteredProducts = category 
    ? uniqueProducts.filter(product => 
        product.category && product.category.toLowerCase() === category.toLowerCase()
      )
    : uniqueProducts;

  // If only 1 product with multiple colors in this category, expand each color as separate item
  if (category && filteredProducts.length === 1 && 'colors' in filteredProducts[0] && filteredProducts[0].colors && filteredProducts[0].colors.length > 1) {
    const product = filteredProducts[0];
    filteredProducts = product.colors.map((color: any) => ({
      ...product,
      id: `${product.slug}-${color.name}`,
      displayName: `${product.name} - ${color.name}`,
      selectedColor: color,
      image: color.images.main,
      colors: [color] // Show only this color
    }));
  }

  // Extract colors from product images for accurate color swatches
  useEffect(() => {
    filteredProducts.forEach((product) => {
      if ('colors' in product && product.colors) {
        product.colors.forEach((color: any) => {
          const colorKey = `${product.slug}-${color.name}`;
          if (color.images.main && !extractedProductColors[colorKey]) {
            extractImageColor(color.images.main, (extractedColor) => {
              setExtractedProductColors(prev => ({ ...prev, [colorKey]: extractedColor }));
            });
          }
        });
      }
    });
  }, [filteredProducts, extractedProductColors]);

  // Get category display name
  const getCategoryDisplayName = (cat: string) => {
    switch(cat) {
      case 'tees': return 'T-Shirts';
      case 'hoodies': return 'Hoodies';
      case 'headwear': return 'Headwear';
      case 'bottoms': return 'Bottoms';
      default: return 'All Products';
    }
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
            {category ? getCategoryDisplayName(category) : 'Our Collection'}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-barlow-condensed">
            Discover our carefully curated collection of Modern Arab Apparel. 
            Each piece tells a story of heritage, culture, and contemporary style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <div key={product.id || `${product.slug}-${index}`} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name || 'Product image'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  {'colors' in product && product.colors && product.colors.length > 1 && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {product.colors.length} colors
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
                    {product.displayName ? (
                      <>
                        {product.name}
                        {product.selectedColor && (
                          <span className="block text-lg text-gray-600 font-barlow-condensed font-normal">
                            in {product.selectedColor.name}
                          </span>
                        )}
                      </>
                    ) : (
                      product.name
                    )}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 font-barlow-condensed">
                    {product.description || "A statement piece that combines cultural heritage with modern streetwear."}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-black">{product.price}</span>
                      {('originalPrice' in product && product.originalPrice && product.originalPrice !== product.price) && (
                        <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    {product.selectedColor ? (
                      <div className="flex space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-gray-300"
                          style={{ backgroundColor: product.selectedColor.hex }}
                          title={product.selectedColor.name}
                        />
                      </div>
                    ) : (
                      'colors' in product && product.colors && (
                        <div className="flex space-x-2">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-gray-300"
                              style={{ backgroundColor: extractedProductColors[`${product.slug}-${color.name}`] || color.hex }}
                              title={color.name}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-600">+{product.colors.length - 3}</span>
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                  
                  {'specifications' in product && product.specifications && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{product.specifications.material}</span>
                        <span>{product.specifications.fit}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div 
          className="mt-20 bg-white rounded-lg shadow-xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-3xl font-light mb-8 text-center text-black font-bodoni"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why Choose Modern Arab Apparel?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
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
                      <Feather className="w-8 h-8" strokeWidth={1} />
                    </div>
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-medium text-black group-hover:text-black transition-colors duration-300 mb-3 font-bodoni">
                    Authentic Design
                  </h3>
                  <p className="text-gray-600 font-barlow-condensed mb-4">
                    Arabic calligraphy designed by first-generation and native speakers 
                    for cultural authenticity and respect.
                  </p>
                  
                  {/* Accent line */}
                  <div className="w-8 h-px bg-gray-300 group-hover:bg-black transition-all duration-300"></div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                      <Star className="w-8 h-8" strokeWidth={1} />
                    </div>
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-medium text-black group-hover:text-black transition-colors duration-300 mb-3 font-bodoni">
                    Premium Quality
                  </h3>
                  <p className="text-gray-600 font-barlow-condensed mb-4">
                    100% premium carded cotton with garment-dyed, pre-shrunk fabric 
                    for lasting comfort and durability.
                  </p>
                  
                  {/* Accent line */}
                  <div className="w-8 h-px bg-gray-300 group-hover:bg-black transition-all duration-300"></div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
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
                      <MapPin className="w-8 h-8" strokeWidth={1} />
                    </div>
                  </motion.div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-lg font-medium text-black group-hover:text-black transition-colors duration-300 mb-3 font-bodoni">
                    Los Angeles Design
                  </h3>
                  <p className="text-gray-600 font-barlow-condensed mb-4">
                    Designed in Los Angeles, bridging heritage with hometown identity 
                    for the modern Arab experience.
                  </p>
                  
                  {/* Accent line */}
                  <div className="w-8 h-px bg-gray-300 group-hover:bg-black transition-all duration-300"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-black text-white rounded-lg p-8">
            <h2 className="text-3xl font-light mb-4 font-bodoni">Join the Movement</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto font-barlow-condensed">
              Be part of a community that celebrates authentic Arab culture and challenges 
              misconceptions through powerful, meaningful fashion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about-us"
                className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Learn Our Story
              </Link>
              <Link
                href="/contact"
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}