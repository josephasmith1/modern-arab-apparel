"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { products } from './products/data';
import Footer from '@/components/Footer';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState(products[0].colors[0]);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'inches' | 'cm'>('inches');
  const [quantity, setQuantity] = useState(1);

  const productData = products[0]; // Featured product

  return (
    <div className="text-black" style={{ backgroundColor: '#f0edec' }}>
      {/* Hero Section with Full-Width Image */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src={selectedColor.images.main}
            alt={`${productData.name} - ${selectedColor.name}`}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-6xl md:text-8xl font-light mb-4 text-white drop-shadow-2xl font-bodoni uppercase">
              Modern Arab Apparel
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg font-my-soul">
              Where Heritage Meets Contemporary Style
            </p>
            <button 
              className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
              onClick={() => document.getElementById('featured-product')?.scrollIntoView({ behavior: 'smooth' })}
            >
              DISCOVER COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section id="featured-product" className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 font-bodoni">Featured: {productData.name}</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed mb-8 text-black font-barlow-condensed">{productData.description}</p>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 font-barlow-condensed">{productData.fullDescription}</p>
          </div>

          {/* Product Selection */}
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Color Selection */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-light mb-2 font-bodoni">Choose Your Color</h3>
                <p className="text-gray-600 font-barlow-condensed">{selectedColor.name}</p>
              </div>
              
              <div className="flex justify-center space-x-6">
                {productData.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-20 h-20 rounded-full border-4 transition-all ${
                      selectedColor.name === color.name 
                        ? 'border-black shadow-2xl scale-110' 
                        : 'border-gray-400 hover:border-gray-600 hover:scale-105'
                    }`}
                  >
                    <span 
                      className="absolute inset-2 rounded-full"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="sr-only">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-light mb-2 font-bodoni">Select Your Size</h3>
                <button 
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-gray-600 hover:text-black underline font-barlow-condensed"
                >
                  View Size Guide
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {productData.sizeGuide.map((sizeInfo) => (
                  <button
                    key={sizeInfo.size}
                    onClick={() => setSelectedSize(sizeInfo.size)}
                    className={`py-4 px-6 border-2 rounded-xl text-center font-medium transition-all ${
                      selectedSize === sizeInfo.size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {sizeInfo.size}
                  </button>
                ))}
              </div>

              {showSizeGuide && (
                <div className="mt-8 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xl font-black font-bodoni">Size Guide</h4>
                    <div className="flex bg-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setSizeUnit('inches')}
                        className={`px-4 py-2 text-sm transition-colors ${
                          sizeUnit === 'inches' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        Inches
                      </button>
                      <button
                        onClick={() => setSizeUnit('cm')}
                        className={`px-4 py-2 text-sm transition-colors ${
                          sizeUnit === 'cm' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'
                        }`}
                      >
                        CM
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-3">Size</th>
                          <th className="text-left py-3">Length ({sizeUnit})</th>
                          <th className="text-left py-3">Chest ({sizeUnit})</th>
                          <th className="text-left py-3">Sleeve ({sizeUnit})</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.sizeGuide.map((size) => (
                          <tr key={size.size} className="border-b border-gray-200">
                            <td className="py-3 font-medium">{size.size}</td>
                            <td className="py-3">
                              {sizeUnit === 'inches' ? size.length : `${size.lengthCm} cm`}
                            </td>
                            <td className="py-3">
                              {sizeUnit === 'inches' ? size.chest : `${size.chestCm} cm`}
                            </td>
                            <td className="py-3">
                              {sizeUnit === 'inches' ? size.sleeve : `${size.sleeveCm} cm`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-6">
              <div className="flex justify-center items-center space-x-6">
                <span className="text-lg font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-400 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 border-x border-gray-400 min-w-[3rem] text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                className="w-full max-w-md mx-auto bg-black text-white py-4 text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-2xl block"
                disabled={!selectedSize}
              >
                ADD TO CART - {productData.price}
              </button>

              {!selectedSize && (
                <p className="text-red-400 text-sm text-center font-barlow-condensed">Please select a size</p>
              )}

              <Link 
                href={`/products/${productData.slug}`}
                className="block w-full max-w-md mx-auto text-center py-4 text-lg font-medium text-black border border-black hover:bg-black hover:text-white transition-all"
              >
                VIEW FULL DETAILS
              </Link>
            </div>
          </div>
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
            <h2 className="text-4xl md:text-6xl font-light mb-6 text-white drop-shadow-2xl font-bodoni">
              The Message
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg max-w-3xl mx-auto font-barlow-condensed">
&quot;ألآ تخافون من الله&quot; - A powerful rhetorical question that transcends fear, 
              inspiring reflection and spiritual accountability through authentic Arabic calligraphy.
            </p>
          </div>
        </div>
      </section>

      {/* Lifestyle Photography Sections */}
      {selectedColor.images.lifestyle.length > 0 && (
        <>
          {selectedColor.images.lifestyle.map((image, index) => (
            <section key={index} className="relative h-screen">
              <div className="absolute inset-0">
                <Image
                  src={image}
                  alt={`${productData.name} - Lifestyle ${index + 1}`}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center max-w-4xl px-6">
                  {index === 0 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-light mb-6 text-white drop-shadow-2xl font-bodoni">
                        Modern Heritage
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto font-barlow-condensed">
                        Where tradition meets contemporary style. Designed in Los Angeles, 
                        rooted in authentic Arabic culture.
                      </p>
                    </>
                  )}
                  {index === 1 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-light mb-6 text-white drop-shadow-2xl font-bodoni">
                        Crafted with Purpose
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto font-barlow-condensed">
                        Premium heavyweight carded cotton with a boxy, oversized fit. 
                        Garment-dyed and pre-shrunk for lasting comfort.
                      </p>
                    </>
                  )}
                  {index === 2 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-light mb-6 text-white drop-shadow-2xl font-bodoni">
                        Authentic Expression
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto font-barlow-condensed">
                        Arabic calligraphy designed by first-generation and native speakers. 
                        Every detail honors the language and culture.
                      </p>
                    </>
                  )}
                  {index === 3 && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-light mb-6 text-white drop-shadow-2xl font-bodoni">
                        Reclaiming the Narrative
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto font-barlow-condensed">
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

      {/* Brand Story Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-12 font-bodoni">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl leading-relaxed mb-8 text-black font-barlow-condensed">
              Modern Arab Apparel was born from a desire to challenge stereotypes and reclaim the narrative. 
              We believe that Arabs are not what the world thinks they are—they are better.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-12 font-barlow-condensed">
              Each piece in our collection is designed in Los Angeles with authentic Arabic elements, 
              created by first-generation and native speakers. We bridge heritage with hometown identity, 
              creating clothing that speaks volumes without needing to shout.
            </p>
          </div>
          
          <Link 
            href="/about"
            className="inline-block bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-2xl"
          >
            LEARN MORE
          </Link>
        </div>
      </section>

      {/* Product Features Section */}
      <section className="py-20" style={{ backgroundColor: 'rgba(240, 237, 236, 0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center font-bodoni uppercase">Why Choose Modern Arab</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productData.features.slice(0, 6).map((feature, index) => {
              const getIcon = (featureText: string) => {
                const lowerFeature = featureText.toLowerCase();
                
                // Unisex fit - Modern gender neutral icon
                if (lowerFeature.includes('unisex')) {
                  return (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                  );
                }
                
                // Cotton/Material - Cotton plant flower icon
                if (lowerFeature.includes('cotton') || lowerFeature.includes('fabric')) {
                  return (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c2.21 0 4 1.79 4 4 0 .89-.29 1.71-.78 2.38C16.33 8.75 17 9.8 17 11c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.2.67-2.25 1.78-2.62C10.29 7.71 10 6.89 10 6c0-2.21 1.79-4 2-4zm-5.5 7c1.93 0 3.5 1.57 3.5 3.5S8.43 16 6.5 16 3 14.43 3 12.5 4.57 9 6.5 9zm11 0c1.93 0 3.5 1.57 3.5 3.5S19.43 16 17.5 16 14 14.43 14 12.5 15.57 9 17.5 9zM12 16c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>
                    </svg>
                  );
                }
                
                // Arabic calligraphy/Cultural - Feather quill pen icon
                if (lowerFeature.includes('arabic') || lowerFeature.includes('calligraphy')) {
                  return (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75"/>
                    </svg>
                  );
                }
                
                // Los Angeles/Location - City buildings skyline
                if (lowerFeature.includes('los angeles') || lowerFeature.includes('designed')) {
                  return (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V7h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                    </svg>
                  );
                }
                
                // Garment-dyed/Process - Fabric with water droplet processing
                if (lowerFeature.includes('garment') || lowerFeature.includes('dyed') || lowerFeature.includes('shrunk')) {
                  return (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9l-5.91 6.34L18 22l-6-3.27L6 22l1.91-6.66L2 9l6.91-.74L12 2z"/>
                      <circle cx="6" cy="6" r="2" opacity="0.7"/>
                      <circle cx="18" cy="6" r="2" opacity="0.7"/>
                      <circle cx="6" cy="18" r="2" opacity="0.7"/>
                      <circle cx="18" cy="18" r="2" opacity="0.7"/>
                    </svg>
                  );
                }
                
                // Fit/Style - Modern t-shirt silhouette
                if (lowerFeature.includes('fit') || lowerFeature.includes('oversized') || lowerFeature.includes('boxy')) {
                  return (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 4h1.5C18.33 4 19 4.67 19 5.5S18.33 7 17.5 7H16v13H8V7H6.5C5.67 7 5 6.33 5 5.5S5.67 4 6.5 4H8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z"/>
                    </svg>
                  );
                }
                
                // Default - star for premium quality
                return (
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                );
              };
              
              return (
                <div key={index} className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    {getIcon(feature)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-black capitalize">{feature}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8 font-bodoni">Join the Movement</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-12 font-barlow-condensed">
            Be part of a community that celebrates authentic Arab culture and challenges misconceptions 
            through powerful, meaningful fashion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href={`/products/${productData.slug}`}
              className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-2xl"
            >
              SHOP NOW
            </Link>
            <Link 
              href="/contact"
              className="border border-black text-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all"
            >
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}