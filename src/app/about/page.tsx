"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Footer from '@/components/Footer';

export default function About() {
  const [imageBackgroundColors, setImageBackgroundColors] = useState<{ [key: string]: string }>({});
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -150]);
  const y2 = useTransform(scrollY, [0, 800], [0, 150]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.3]);
  
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

  // Extract background colors from all images used in the page
  const aboutImages = useMemo(() => [
    '/about-images/IMG_3487_085f7aae-632c-4e09-9321-1c5aad742324_750x.webp',
    '/about-images/91E379F9-711A-4065-AE1F-92F98E3362E7-2_750x.webp',
    '/about-images/9D0D7091-2A2E-4DFE-932A-2B0524728C37-2_750x.webp',
    '/about-images/E825F596-F659-492B-B7B0-91E9F2A41B60_750x.webp',
    '/about-images/MG_0610_e8ce70c1-9773-420d-8417-8c0bf67d38d9_750x.webp',
    '/about-images/IMG_3488_36377c4b-1872-4460-9967-6b9e8d413185_750x.webp',
    '/about-images/5BBA9EAF-DA9E-4904-B901-8A1E5CF2FE55-3_750x.webp',
    '/about-images/3F14D18B-F3ED-443B-A39E-79103E05E1DF_750x.webp',
    '/about-images/IMG_3492_750x.webp',
    '/about-images/IMG_3498_750x.webp',
    '/about-images/MG_0889_750x.webp',
    '/about-images/MG_0941_750x.webp'
  ], []);

  useEffect(() => {
    aboutImages.forEach((image) => {
      if (!imageBackgroundColors[image]) {
        extractExactBackgroundColor(image, (color) => {
          setImageBackgroundColors(prev => ({ ...prev, [image]: color }));
        });
      }
    });
  }, [imageBackgroundColors, aboutImages]);

  return (
    <div className="text-black font-barlow-condensed overflow-hidden scroll-smooth" style={{ backgroundColor: '#f0edec' }}>
      {/* Hero Section */}
      <section className="relative h-screen">
        <motion.div 
          className="absolute inset-0"
          style={{ 
            y: y1,
            backgroundColor: imageBackgroundColors['/about-images/IMG_3487_085f7aae-632c-4e09-9321-1c5aad742324_750x.webp'] || 'rgb(240, 237, 236)' 
          }}
        >
          <Image
            src="/about-images/IMG_3487_085f7aae-632c-4e09-9321-1c5aad742324_750x.webp"
            alt="Modern Arab Apparel"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <motion.div 
            className="absolute inset-0 bg-black/40"
            style={{ opacity }}
          />
        </motion.div>
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <div className="text-center max-w-4xl px-6">
            <motion.h1 
              className="text-7xl md:text-9xl font-extralight mb-8 text-white drop-shadow-2xl font-bodoni uppercase tracking-widest"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.05, ease: "easeOut" }}
            >
              The Story
            </motion.h1>
            <motion.p 
              className="text-2xl md:text-3xl font-light text-gray-200 mb-12 drop-shadow-lg font-my-soul tracking-wide"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: 0.1, ease: "easeOut" }}
            >
              We are Modern Arab, and this is the narrative.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* About Modern Arab Section */}
      <motion.section 
        className="py-20 relative overflow-hidden" 
        style={{ backgroundColor: '#f0edec' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        viewport={{ once: true }}
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 bg-black rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-black rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2 
            className="text-5xl md:text-6xl font-extralight mb-12 text-center font-bodoni uppercase text-black tracking-widest"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: 0.025 }}
            viewport={{ once: true }}
          >
            About Modern Arab
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1, delay: 0.05 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-2xl font-light leading-relaxed mb-8 text-black tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Los Angeles original, Arab American Premium Wear Apparel Brand.
              </motion.p>
              <motion.p 
                className="text-xl font-light text-gray-700 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
              >
                A one hundred percent original brand, Modern Arab is determined to change the narrative about Arabs today through western style premium wear. We believe in cultural pride, inclusion, and storytelling through fashion. Every piece we create is designed to inspire conversation, challenge outdated narratives, and empower individuals to wear their Arabic heritage with confidence.
              </motion.p>
            </motion.div>
            <motion.div 
              className="relative h-[800px] lg:h-[900px] rounded-2xl shadow-2xl overflow-hidden group backdrop-blur-sm border border-white/10"
              style={{ backgroundColor: imageBackgroundColors['/about-images/91E379F9-711A-4065-AE1F-92F98E3362E7-2_750x.webp'] || 'rgb(240, 237, 236)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1, delay: 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, rotateY: 2 }}
            >
              <Image
                src="/about-images/91E379F9-711A-4065-AE1F-92F98E3362E7-2_750x.webp"
                alt="Modern Arab Fashion"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: 0.075 }}
            viewport={{ once: true }}
          >
            <p className="text-xl font-light text-gray-700 leading-relaxed max-w-3xl mx-auto tracking-wide">
              Modern Arab&apos;s commitment is to define Arab identity through fashion. As we remove radical stereotypes with Arabic inspired apparel, we change the narrative about Arabic speaking people on the global scale. We are bridging cultures by encouraging the right conversations and invite dialogue for inclusion, culture, and belonging.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Mission Section */}
      <motion.section 
        className="py-20" 
        style={{ backgroundColor: 'rgba(240, 237, 236, 0.5)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <motion.div 
              className="relative h-[800px] lg:h-[900px] rounded-lg shadow-2xl overflow-hidden group"
              style={{ 
                backgroundColor: imageBackgroundColors['/about-images/9D0D7091-2A2E-4DFE-932A-2B0524728C37-2_750x.webp'] || 'rgb(240, 237, 236)',
                y: y2 
              }}
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
            >
              <Image
                src="/about-images/9D0D7091-2A2E-4DFE-932A-2B0524728C37-2_750x.webp"
                alt="Our Mission"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-5xl md:text-6xl font-extralight mb-8 font-bodoni uppercase text-black tracking-widest"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Our Mission
              </motion.h2>
              <motion.p 
                className="text-xl font-light leading-relaxed mb-6 text-black tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                viewport={{ once: true }}
              >
                At Modern Arab, we believe that everyone who embraces Arab culture deserves to look their best and feel their safest—unapologetically proud and authentically themselves. That belief sparked our journey to challenge misconceptions and create a space where modern fashion meets cultural heritage.
              </motion.p>
              <motion.p 
                className="text-xl font-medium leading-relaxed mb-6 text-black"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.25 }}
                viewport={{ once: true }}
              >
                By blending style with purpose, we reveal the true essence of Arab identity—one of peace, faith, and cultural richness—while breaking harmful stereotypes along the way.
              </motion.p>
              <motion.p 
                className="text-xl font-medium leading-relaxed text-black"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Our mission is simple yet powerful: to redefine Arab representation through premium, trendsetting apparel. Every piece we design is crafted to celebrate inclusivity, individuality, and the beauty of a multicultural world.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Full-Width Image Section */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: imageBackgroundColors['/about-images/E825F596-F659-492B-B7B0-91E9F2A41B60_750x.webp'] || 'rgb(240, 237, 236)' }}
        >
          <Image
            src="/about-images/E825F596-F659-492B-B7B0-91E9F2A41B60_750x.webp"
            alt="Modern Arab Movement"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h2 className="text-5xl md:text-7xl font-medium mb-8 text-white drop-shadow-2xl font-bodoni uppercase">
              Not Just Clothing
            </h2>
            <p className="text-2xl md:text-3xl font-medium text-gray-200 drop-shadow-lg max-w-3xl mx-auto">
              This isn&apos;t just clothing—it&apos;s a statement of identity, confidence, and connection. Welcome to Modern Arab—where culture meets modernity in every stitch.
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-medium mb-12 text-center font-bodoni uppercase text-black">About Us</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <p className="text-xl font-medium leading-relaxed mb-6 text-black">
                Modern Arab Apparel isn&apos;t just a brand—it&apos;s a movement. Born from the experiences of first-generation Arab Americans, our roots stretch across the diverse landscapes of the Arab world and the dynamic pulse of the West. Through education, work, and travel, we&apos;ve lived the intersection of these cultures, shaping a vision that redefines Arab identity.
              </p>
              <p className="text-xl font-medium leading-relaxed text-black">
                At Modern Arab, we challenge outdated narratives that misrepresent Arabic-speaking communities. Our mission is to highlight the beauty, depth, and pride of Arab heritage—bridging the gap between tradition and modernity. This is more than fashion; it&apos;s a statement. Every design tells a story of culture, resilience, and unity. Join us in rewriting the script and celebrating what it truly means to be Modern Arab.
              </p>
            </div>
            <div 
              className="relative h-[800px] lg:h-[900px] rounded-lg shadow-2xl overflow-hidden"
              style={{ backgroundColor: imageBackgroundColors['/about-images/MG_0610_e8ce70c1-9773-420d-8417-8c0bf67d38d9_750x.webp'] || 'rgb(240, 237, 236)' }}
            >
              <Image
                src="/about-images/MG_0610_e8ce70c1-9773-420d-8417-8c0bf67d38d9_750x.webp"
                alt="About Us"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20" style={{ backgroundColor: 'rgba(240, 237, 236, 0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div 
              className="relative h-[700px] lg:h-[800px] rounded-lg shadow-2xl overflow-hidden"
              style={{ backgroundColor: imageBackgroundColors['/about-images/IMG_3488_36377c4b-1872-4460-9967-6b9e8d413185_750x.webp'] || 'rgb(240, 237, 236)' }}
            >
              <Image
                src="/about-images/IMG_3488_36377c4b-1872-4460-9967-6b9e8d413185_750x.webp"
                alt="Our Story"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center"
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-5xl md:text-6xl font-medium mb-8 font-bodoni uppercase text-black">Our Story</h2>
              <p className="text-xl font-medium leading-relaxed mb-6 text-black">
                Our mission is bold and clear: to redefine Arab identity in today&apos;s world through culture and fashion. Every piece we create tells a story—of heritage, creativity, and unapologetic style.
              </p>
              <p className="text-xl font-medium leading-relaxed mb-6 text-black">
                At Modern Arab, we challenge stereotypes and shift perspectives, celebrating the beauty, depth, and peaceful presence of Arabic-speaking communities worldwide. To us, being Arab is more than a label—it&apos;s a legacy of resilience, pride, and artistry that deserves to be shared.
              </p>
              <p className="text-xl font-medium leading-relaxed text-black">
                This is Modern Arab. A movement, a statement, a celebration—one story, one piece at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-6xl font-medium mb-12 font-bodoni uppercase text-black">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <h3 className="text-lg font-light mb-2 font-bodoni">Diversity</h3>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-light mb-2 font-bodoni">Inclusion</h3>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-light mb-2 font-bodoni">Sustainability</h3>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-light mb-2 font-bodoni">Ethics</h3>
            </div>
          </div>

          <p className="text-2xl font-bold leading-relaxed mb-12 text-black">
            At Modern Arab, we embody the spirit of a blended Arab identity in today&apos;s modern world. Our values are rooted in diversity, inclusion, sustainability, and ethical practices—pillars that guide everything we do.
          </p>
          <p className="text-2xl font-bold leading-relaxed text-black">
            We partner with reliable suppliers who share our commitment to transparency and integrity, ensuring every piece reflects our shared values. Beyond fashion, we&apos;re dedicated to reducing our environmental footprint and creating a positive impact within our communities. Most importantly, we hold our customers at the heart of everything we do, striving to meet their needs with care, quality, and a deep appreciation for their support.
          </p>
        </div>
      </section>

      {/* Flagship Design Section */}
      <motion.section 
        className="py-20 relative overflow-hidden" 
        style={{ backgroundColor: 'rgba(240, 237, 236, 0.9)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-extralight mb-8 font-bodoni uppercase text-black tracking-widest"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Our Flagship Design
            </motion.h2>
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 rounded-2xl blur-2xl"></div>
                <p className="text-6xl md:text-7xl font-arabic text-black mb-4 relative z-10 px-8 py-4">
                  ألآ تخافون من الله
                </p>
              </motion.div>
              <motion.p 
                className="text-2xl md:text-3xl font-light text-gray-800 mb-8 tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                viewport={{ once: true }}
              >
                &quot;Don&apos;t you fear God?&quot;
              </motion.p>
            </motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.p 
                className="text-xl font-light leading-relaxed mb-6 text-black tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Our flagship piece features this powerful Arabic phrase - a rhetorical question that transcends fear and inspires spiritual reflection. This isn&apos;t just a design; it&apos;s a conversation starter about faith, conscience, and cultural identity.
              </motion.p>
              <motion.p 
                className="text-lg font-light text-gray-700 mb-8 italic tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
              >
                &quot;More than words, it&apos;s a call to conscience.&quot;
              </motion.p>
              <motion.div 
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
              >
                <h3 className="text-xl font-light mb-4 text-black tracking-wide">Design Philosophy</h3>
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="font-light text-black mb-2 tracking-wide">Authentic Calligraphy</h4>
                    <p className="text-gray-700">Our Arabic calligraphy is designed by first-generation and native speakers, ensuring cultural authenticity and respect.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="font-light text-black mb-2 tracking-wide">Premium Quality</h4>
                    <p className="text-gray-700">We use only the finest materials and construction techniques to create pieces that last and feel as good as they look.</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <h4 className="font-light text-black mb-2 tracking-wide">Meaningful Design</h4>
                    <p className="text-gray-700">Every element of our designs serves a purpose, carrying cultural significance and personal meaning for the wearer.</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative h-[800px] lg:h-[900px] rounded-lg shadow-2xl overflow-hidden group"
              style={{ backgroundColor: imageBackgroundColors['/about-images/IMG_3492_750x.webp'] || 'rgb(240, 237, 236)' }}
              initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotateY: -5 }}
            >
              <Image
                src="/about-images/IMG_3492_750x.webp"
                alt="Flagship Design"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-1000" />
            </motion.div>
          </div>
        </div>
        
        {/* Floating Background Elements */}
        <motion.div 
          className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-black/10 to-black/5 rounded-full backdrop-blur-sm"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-br from-black/10 to-black/5 rounded-full backdrop-blur-sm"
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Modern Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </motion.section>

      {/* Our Collections Section */}
      <section className="py-20" style={{ backgroundColor: 'rgba(240, 237, 236, 0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-medium mb-12 text-center font-bodoni uppercase text-black">Our Collections</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
            <div className="lg:col-span-2">
              <p className="text-2xl font-bold leading-relaxed mb-10 text-black">
                Our collections celebrate Arab culture, blending classic and contemporary styles inspired by the diverse heritage of every Arab country. Each piece is thoughtfully curated by our team of fashion experts, ensuring a perfect balance between tradition and modern expression.
              </p>
              <p className="text-2xl font-bold leading-relaxed mb-10 text-black">
                From laid-back casual wear to bold street fashion, we design for everyone across the Arab world. As we grow, we&apos;ll introduce personalized styling services—helping you represent your roots with pride and authenticity.
              </p>
              <p className="text-2xl font-black leading-relaxed text-black">
                This isn&apos;t just a collection—it&apos;s a tribute to the unity and individuality of Arab identity. Explore the stories where heritage threads into modern style.
              </p>
            </div>
            <div 
              className="relative h-[700px] lg:h-[800px] rounded-lg shadow-2xl overflow-hidden"
              style={{ backgroundColor: imageBackgroundColors['/about-images/5BBA9EAF-DA9E-4904-B901-8A1E5CF2FE55-3_750x.webp'] || 'rgb(240, 237, 236)' }}
            >
              <Image
                src="/about-images/5BBA9EAF-DA9E-4904-B901-8A1E5CF2FE55-3_750x.webp"
                alt="Our Collections"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tradition Meets Trend Section */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: imageBackgroundColors['/about-images/3F14D18B-F3ED-443B-A39E-79103E05E1DF_750x.webp'] || 'rgb(240, 237, 236)' }}
        >
          <Image
            src="/about-images/3F14D18B-F3ED-443B-A39E-79103E05E1DF_750x.webp"
            alt="Tradition Meets Trend"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h2 className="text-4xl md:text-6xl font-light mb-6 text-white drop-shadow-2xl font-bodoni uppercase">
              Tradition Meets Trend
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg max-w-3xl mx-auto">
              At Modern Arab, we redefine the ordinary—seamlessly blending Arab heritage with modern style. Every printed design and intricately embroidered piece tells a story, honoring the beauty of Arab culture while embracing contemporary fashion.
            </p>
            <p className="text-lg md:text-xl text-gray-300 drop-shadow-lg max-w-3xl mx-auto">
              Step into a world where heritage evolves into modern expression. Experience the artistry, culture, and craftsmanship woven into every piece.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 font-bodoni uppercase">Join the Movement</h2>
          <p className="text-xl leading-relaxed mb-12">
            Be part of a community that celebrates authentic Arab culture and challenges misconceptions 
            through powerful, meaningful fashion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/products"
              className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-2xl uppercase tracking-wider"
            >
              Shop Collection
            </Link>
            <a 
              href="/contact"
              className="border border-black text-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}