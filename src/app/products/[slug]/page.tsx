"use client";

import Image from 'next/image';
import { useState, use, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ColorThief from 'colorthief';
import { notFound } from 'next/navigation';

import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { products, type ProductColor } from '@/app/products/data';
import ProductInfo from '@/components/product/ProductInfo';
import ProductImage from '@/components/product/ProductImage';
import ProductDetails from '@/components/product/ProductDetails';
import ProductMobileUI from '@/components/product/ProductMobileUI';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);

  // Get product data
  const productData = products.find((p) => p.slug === resolvedParams.slug);

  // All hooks must be called at the top level
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
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
    if (productData && productData.colors.length > 0 && !selectedColor) {
      setSelectedColor(productData.colors[0]);
    }
  }, [productData, selectedColor]);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', updateScrollState);
    updateScrollState();

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  const extractImageColor = useCallback((imageUrl: string, callback: (color: string) => void) => {
    const img = document.createElement('img');
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        callback(`rgb(${dominantColor.join(',')})`);
      } catch (error) {
        console.error('Error extracting color:', error);
        callback('#f0edec'); // Fallback color
      }
    };
    img.onerror = () => {
        callback('#f0edec'); // Fallback color on image load error
    };
  }, []);

  useEffect(() => {
    if (!productData || !productData.colors) return;
    productData.colors.forEach((color: ProductColor, index: number) => {
      if (color.images.main && !extractedProductColors[color.name]) {
        setTimeout(() => {
          extractImageColor(color.images.main, (extractedColor: string) => {
            setExtractedProductColors((prev) => ({ ...prev, [color.name]: extractedColor }));
          });
        }, 100 + index * 200);
      }
    });
  }, [productData, extractedProductColors, extractImageColor]);

  const handleColorSelect = useCallback((color: ProductColor) => {
    setSelectedColor(color);
  }, []);

  // Create comprehensive image gallery for selected color
  const currentImages = useMemo(() => {
    if (!selectedColor) return [];
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

  if (!productData || !selectedColor) {
    if (!productData) {
        notFound();
    }
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <div className="text-black font-montserrat" style={{ backgroundColor: '#f0edec' }}>
      <ProductImage 
        images={currentImages} 
        productName={productData.name} 
        selectedColorName={selectedColor.name} 
        heroOpacity={heroOpacity}
        heroScale={heroScale}
        heroX={heroX}
        colorSelectorOpacity={colorSelectorOpacity}
        colorSelectorY={colorSelectorY}
        productColors={productData.colors}
        selectedColor={selectedColor}
        handleColorSelect={handleColorSelect}
        extractedProductColors={extractedProductColors}
        imageBackgroundColors={imageBackgroundColors}
        selectedImageIndex={selectedImageIndex}
        setSelectedImageIndex={setSelectedImageIndex}
      />

      <div className="relative z-10" style={{ paddingTop: '100vh' }}>
        <motion.div style={{ y: contentY }} className="bg-white shadow-2xl rounded-t-3xl">
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <ProductInfo
                product={productData}
                selectedColor={selectedColor}
                onColorSelect={handleColorSelect}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                quantity={quantity}
                onQuantityChange={setQuantity}
                showSizeGuide={showSizeGuide}
                onShowSizeGuideChange={setShowSizeGuide}
                sizeUnit={sizeUnit}
                onSizeUnitChange={setSizeUnit}
                addItemToCart={addItem}
              />
              <motion.div 
                className="space-y-4"
                style={{
                  opacity: columnImageOpacity,
                  scale: columnImageScale,
                }}
              >
                {currentImages.slice(1).map((image, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg bg-white">
                    <Image
                      src={image.url}
                      alt={`${productData.name} - ${selectedColor.name} - ${image.type}`}
                      width={800}
                      height={1000}
                      className="w-full h-auto"
                      priority={index < 2} // Prioritize loading of first few images
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </section>

          <ProductDetails product={productData} />

          <Footer />
        </motion.div>
      </div>

      <ProductMobileUI
        product={productData}
        selectedColor={selectedColor}
        onColorSelect={handleColorSelect}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        quantity={quantity}
        onQuantityChange={setQuantity}
        addItemToCart={addItem}
        isScrolled={isScrolled}
        showColorOptions={showColorOptions}
        onShowColorOptionsChange={setShowColorOptions}
      />
    </div>
  );
}
