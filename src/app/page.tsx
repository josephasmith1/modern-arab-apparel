"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { products } from './products/data';
import Footer from '@/components/Footer';

export default function Home() {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [hoveredCollection, setHoveredCollection] = useState<number | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [heroBackgroundColors, setHeroBackgroundColors] = useState<{ [key: string]: string }>({});
  
  // Extract exact background color from image corners
  const extractExactBackgroundColor = (imageSrc: string, callback: (color: string) => void) => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    
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
      callback('rgb(240, 237, 236)'); // fallback to page background color
    };
    img.src = imageSrc;
  };

  // Extract background colors from all hero images
  useEffect(() => {
    heroImages.forEach((image) => {
      if (!heroBackgroundColors[image]) {
        extractExactBackgroundColor(image, (color) => {
          setHeroBackgroundColors(prev => ({ ...prev, [image]: color }));
        });
      }
    });
  }, [heroBackgroundColors]);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroImages = [
    'https://modernarabapparel.com/cdn/shop/files/IMG-3317_1800x1800.jpg',
    'https://modernarabapparel.com/cdn/shop/files/MG_0159_1800x1800.jpg',
    'https://modernarabapparel.com/cdn/shop/files/MG_0070_1800x1800.jpg',
    'https://modernarabapparel.com/cdn/shop/files/IMG-3331_1800x1800.jpg'
  ];

  const collections = [
    {
      title: "Tops & Tees",
      subtitle: "Premium comfort meets cultural expression",
      image: "https://modernarabapparel.com/cdn/shop/files/oversized-faded-t-shirt-faded-khaki-front-67e7da798329f_1800x1800.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/oversized-faded-t-shirt-faded-khaki-back-67e7da7983d55_1800x1800.jpg",
      link: "/products?category=tees",
      accent: "Experience comfort and style with our Modern Arab Tees."
    },
    {
      title: "Layers",
      subtitle: "Hoodies, crewnecks and cropped styles",
      image: "https://modernarabapparel.com/cdn/shop/files/unisex-premium-hoodie-black-front-67cbcdde72ba6_1400x.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/unisex-premium-hoodie-black-back-67cbcddeb1073_1400x.jpg",
      link: "/products?category=hoodies", 
      accent: "Perfect for everyday wear or as a base layer."
    },
    {
      title: "Headwear",
      subtitle: "Caps, hats and beanies with attention to detail",
      image: "https://modernarabapparel.com/cdn/shop/files/classic-dad-hat-black-front-67ca2b4edc0fe_1800x1800.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/fisherman-beanie-ecru-front-67d1276ae6133_1800x1800.jpg",
      link: "/products?category=headwear",
      accent: "Crafted from luxurious materials with classic design."
    },
    {
      title: "Bottoms",
      subtitle: "Joggers and sweatpants for modern comfort",
      image: "https://modernarabapparel.com/cdn/shop/files/unisex-fleece-sweatpants-military-green-front-67cce68fe8dd3_1800x1800.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/unisex-pigment-dyed-sweatpants-pigment-alpine-green-front-681b0b62cc397_1800x1800.jpg",
      link: "/products?category=bottoms",
      accent: "Complete your look with premium essentials."
    }
  ];

  const featuredProducts = [
    {
      name: "Modern Arab Faded Tee",
      price: "from $45.00",
      image: "https://modernarabapparel.com/cdn/shop/files/oversized-faded-t-shirt-faded-khaki-front-67e7da798329f_1800x1800.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/oversized-faded-t-shirt-faded-khaki-back-67e7da7983d55_1800x1800.jpg",
      slug: "modern-arab-faded-tee"
    },
    {
      name: "Modern Arab Hoodie", 
      price: "from $60.00",
      image: "https://modernarabapparel.com/cdn/shop/files/unisex-premium-hoodie-black-front-67cbcdde72ba6_1400x.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/unisex-premium-hoodie-black-back-67cbcddeb1073_1400x.jpg",
      slug: "modern-arab-hoodie"
    },
    {
      name: "Modern Arab Joggers",
      price: "from $50.00", 
      image: "https://modernarabapparel.com/cdn/shop/files/unisex-fleece-sweatpants-military-green-front-67cce68fe8dd3_1800x1800.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/unisex-fleece-sweatpants-military-green-back-67cce68fe8e32_1800x1800.jpg",
      slug: "modern-arab-joggers"
    },
    {
      name: "Modern Arab Cap",
      price: "$30.00",
      image: "https://modernarabapparel.com/cdn/shop/files/classic-dad-hat-black-front-67ca2b4edc0fe_1800x1800.jpg",
      hoverImage: "https://modernarabapparel.com/cdn/shop/files/classic-dad-hat-black-back-67ca2b4edd02e_1800x1800.jpg",
      slug: "modern-arab-cap"
    }
  ];

  return (
    <div className="text-black" style={{ backgroundColor: '#f0edec' }}>
      {/* Hero Banner Notice */}
      <motion.div 
        className="bg-black text-white py-3 text-center text-sm font-barlow-condensed tracking-wider"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        MODERN ARAB SUMMER COLLECTION COMING SOON
      </motion.div>

      {/* Hero Section - Magazine Style */}
      <section className="relative overflow-hidden" style={{ height: '90vh' }}>
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: index === currentHeroImage ? 1 : 0,
                scale: index === currentHeroImage ? 1 : 1.1 
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ backgroundColor: heroBackgroundColors[image] || 'rgb(240, 237, 236)' }}
            >
              <Image
                src={image}
                alt={`Modern Arab Collection ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain object-center"
                priority={index === 0}
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
        </div>
        
        {/* Hero Content - Magazine Layout */}
        <div className="absolute inset-0 flex items-center">
          {/* Left: Large Typography */}
          <motion.div
            className="absolute left-8 max-w-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
                <motion.div 
                  className="mb-4"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <span className="text-white/80 text-sm font-barlow-condensed tracking-widest uppercase">
                    Modern Arab Apparel
                  </span>
                </motion.div>
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white leading-none font-bodoni mb-6">
                  Modern<br />
                  <span className="italic">Arab</span>
                </h1>
                <motion.p 
                  className="text-xl md:text-2xl text-white/90 font-barlow-condensed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  Where heritage meets contemporary style. Culture, pride, inclusion, and storytelling through fashion.
                </motion.p>
              </motion.div>

          {/* Right: Call to Action Box */}
          <motion.div
            className="absolute bottom-8 right-8 max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
                <div className="bg-white/20 backdrop-blur-md p-8 max-w-md rounded-lg">
                  <div className="mb-6">
                    <span className="text-xs font-bold tracking-widest text-gray-500 uppercase font-barlow-condensed">
                      Featured Collection
                    </span>
                    <h3 className="text-2xl font-light text-black font-bodoni mt-2">
                      Modern Arab Collection
                    </h3>
                  </div>
                  <p className="text-gray-700 font-barlow-condensed mb-6 leading-relaxed">
                    Changing the narrative and owning the culture. Every piece designed to inspire conversation and empower individuals.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="/products"
                      className="block w-full bg-black text-white text-center py-3 font-semibold tracking-wide hover:bg-gray-800 transition-colors duration-300 font-barlow-condensed"
                    >
                      EXPLORE COLLECTION
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
        </div>

        {/* Hero Navigation Dots */}
        <div className="absolute bottom-8 left-8 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentHeroImage ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-black font-bodoni">
              Modern Arab
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-barlow-condensed">
              Modern Arab is an Apparel Brand from Los Angeles. We believe in culture, pride, inclusion, and storytelling through fashion. Every piece we create is designed to inspire conversation, challenge outdated narratives, and empower individuals to wear the Arabic language and heritage with confidence. 
              <span className="text-black font-medium"> We are changing the narrative and owning the culture.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Collections Grid - Magazine Style */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-4 text-black font-bodoni">
              Collection List
            </h2>
            <p className="text-lg text-gray-600 font-barlow-condensed">
              Complete your look with Modern Arab's premium essentials
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.title}
                className="group relative overflow-hidden bg-white border border-gray-200 hover:border-black transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onMouseEnter={() => setHoveredCollection(index)}
                onMouseLeave={() => setHoveredCollection(null)}
              >
                <Link href={collection.link}>
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src={hoveredCollection === index ? collection.hoverImage : collection.image}
                      alt={collection.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain object-center group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  
                  <div className="p-8">
                    <div className="mb-3">
                      <span className="text-xs font-bold tracking-widest text-gray-500 uppercase font-barlow-condensed">
                        Collection
                      </span>
                    </div>
                    <h3 className="text-2xl font-light text-black font-bodoni mb-3 group-hover:text-gray-700 transition-colors">
                      {collection.title}
                    </h3>
                    <p className="text-gray-600 font-barlow-condensed mb-4 leading-relaxed">
                      {collection.subtitle}
                    </p>
                    <p className="text-sm text-gray-500 font-barlow-condensed italic">
                      {collection.accent}
                    </p>
                    
                    {/* Accent line */}
                    <div className="w-12 h-px bg-gray-300 group-hover:bg-black mt-4 transition-all duration-300"></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Collection Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <span className="text-sm font-medium tracking-wide text-gray-500 uppercase font-barlow-condensed">
                Latest Collection
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
              Spring Drop
            </h2>
            <p className="text-base text-gray-600 font-barlow-condensed max-w-xl mx-auto leading-relaxed">
              Complete your look with Modern Arab's premium essentials, perfect for any occasion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.slug}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                onMouseEnter={() => setHoveredProduct(index)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative overflow-hidden mb-4 bg-gray-50">
                    <div className="aspect-square relative">
                      <Image
                        src={hoveredProduct === index ? product.hoverImage : product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain object-center group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    
                    {/* Quick view overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white text-sm font-barlow-condensed tracking-wider">
                        QUICK VIEW
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-light text-black font-bodoni group-hover:text-gray-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 font-barlow-condensed">
                      Modern Arab Apparel
                    </p>
                    <p className="text-black font-medium font-bodoni">
                      {product.price}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/products"
              className="inline-block border border-black text-black px-8 py-3 font-semibold tracking-wide hover:bg-black hover:text-white transition-all duration-300 font-barlow-condensed"
            >
              VIEW ALL
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Premium Tees Spotlight */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase font-barlow-condensed">
                  Premium Collection
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-black font-bodoni">
                PREMIUM Tees
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-8 font-barlow-condensed">
                Experience comfort and style with our Modern Arab Tees.
              </p>
              <p className="text-gray-600 font-barlow-condensed leading-relaxed mb-8">
                Rooted in meaning and made for movement, featuring authentic Arabic calligraphy designed by first-generation and native speakers. Each piece challenges stereotypes and reclaims the narrative through language, pride, and presence.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/products?category=tees"
                  className="inline-block bg-black text-white px-8 py-3 font-semibold tracking-wide hover:bg-gray-800 transition-colors duration-300 font-barlow-condensed"
                >
                  SHOP TEES
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative h-96 lg:h-[500px]">
                <Image
                  src="/images/tee-no-background.png"
                  alt="Modern Arab Faded Tee"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain object-center rounded"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-black font-bodoni">
              FAQs
            </h2>
          </motion.div>

          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-light text-black font-bodoni mb-3">
                What does Modern Arab stand for?
              </h3>
              <p className="text-gray-600 font-barlow-condensed leading-relaxed">
                Modern Arab represents the bridge between heritage and contemporary identity. We create fashion that challenges stereotypes and empowers individuals to wear Arabic culture with pride and confidence.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-light text-black font-bodoni mb-3">
                How is Modern Arab different from other streetwear brands?
              </h3>
              <p className="text-gray-600 font-barlow-condensed leading-relaxed">
                Our designs feature authentic Arabic calligraphy created by first-generation and native speakers. Every piece tells a story of cultural reclamation and challenges misconceptions through meaningful fashion.
              </p>
            </div>

            <div className="text-center pt-8">
              <Link 
                href="/faqs"
                className="inline-block border border-black text-black px-8 py-3 font-semibold tracking-wide hover:bg-black hover:text-white transition-all duration-300 font-barlow-condensed"
              >
                VIEW ALL FAQs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-black font-bodoni">
              Sign up and save
            </h2>
            <p className="text-lg text-gray-600 font-barlow-condensed mb-8">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black font-barlow-condensed"
                />
                <button className="bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition-colors duration-300 font-barlow-condensed">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}