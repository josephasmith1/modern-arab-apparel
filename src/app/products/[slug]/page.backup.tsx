"use client";

import { useState, use, useEffect, useMemo, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products, type ProductColor } from '@/app/products/data';
import { useColorExtractor } from '@/hooks/useColorExtractor';
import ProductImage from '@/components/product/ProductImage';
import ProductInfo from '@/components/product/ProductInfo';
import ProductDetails from '@/components/product/ProductDetails';
import Footer from '@/components/Footer';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const productData = products.find((p) => p.slug === resolvedParams.slug);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [extractedProductColors, setExtractedProductColors] = useState<{ [key: string]: string }>({});

  const { extractImageColor } = useColorExtractor();
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 500], [0, -50]);

  useEffect(() => {
    if (productData && productData.colors.length > 0 && !selectedColor) {
      setSelectedColor(productData.colors[0]);
    }
  }, [productData, selectedColor]);

  useEffect(() => {
    if (productData?.colors) {
      productData.colors.forEach((color) => {
        if (color.images.main && !extractedProductColors[color.name]) {
          extractImageColor(color.images.main, (extractedColor) => {
            setExtractedProductColors((prev) => ({ ...prev, [color.name]: extractedColor }));
          });
        }
      });
    }
  }, [productData, extractImageColor, extractedProductColors]);

  const currentImages = useMemo(() => {
    if (!selectedColor) return [];
    const images = [];
    if (selectedColor.images?.main) images.push({ url: selectedColor.images.main, type: 'main' });
    if (selectedColor.images?.back) images.push({ url: selectedColor.images.back, type: 'back' });
    if (selectedColor.images?.lifestyle) {
      selectedColor.images.lifestyle.forEach((img, index) => {
        images.push({ url: img, type: `lifestyle-${index}` });
      });
    }
    return images;
  }, [selectedColor]);

  const handleColorSelect = useCallback((color: ProductColor) => {
    setSelectedColor(color);
  }, []);

  if (!productData) {
    notFound();
    return null;
  }

  if (!selectedColor) {
    return null; // Or a loading spinner
  }

  return (
    <div className="text-black font-montserrat" style={{ backgroundColor: '#f0edec' }}>
      <ProductImage 
        images={currentImages} 
        productName={productData.name} 
        selectedColorName={selectedColor.name} 
      />

      <div className="relative z-10" style={{ paddingTop: '100vh' }}>
        <motion.div style={{ y: contentY }} className="bg-white shadow-2xl rounded-t-3xl">
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <ProductInfo
                product={productData}
                selectedColor={selectedColor}
                handleColorSelect={handleColorSelect}
                extractedProductColors={extractedProductColors}
              />
              <div className="space-y-4">
                {currentImages.map((image, index) => (
                  <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={image.url}
                      alt={`${productData.name} - ${selectedColor.name} - ${image.type}`}
                      width={800}
                      height={1000}
                      className="w-full h-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ProductDetails product={productData} />

          <Footer />
        </motion.div>
      </div>

      
    </div>
  );
}
