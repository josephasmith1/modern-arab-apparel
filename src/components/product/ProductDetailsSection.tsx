'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shirt, Heart, Users, Package } from 'lucide-react';

interface ProductDetailsSectionProps {
  fullDescription: string;
}

export default function ProductDetailsSection({ fullDescription }: ProductDetailsSectionProps) {
  const [sections, setSections] = useState({
    mainDescription: '',
    designInspiration: '',
    features: [] as string[],
    whyChoose: '',
    perfectFor: [] as string[],
    pairWith: ''
  });

  // Parse the HTML description to extract sections
  const parseDescription = (html: string) => {
    const sections = {
      mainDescription: '',
      designInspiration: '',
      features: [] as string[],
      whyChoose: '',
      perfectFor: [] as string[],
      pairWith: ''
    };

    // Remove HTML tags but preserve structure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const paragraphs = tempDiv.querySelectorAll('p');
    const lists = tempDiv.querySelectorAll('ul');
    
    // First, try to extract the main description - usually the first few paragraphs
    const firstParagraphs = Array.from(paragraphs).slice(0, 5);
    firstParagraphs.forEach((p) => {
      const text = p.textContent || '';
      // Skip if it's a header or contains bullet points
      if (!text.includes(':') && !text.includes('•') && !text.includes('Disclaimer') && text.length > 50) {
        sections.mainDescription += text + ' ';
      }
    });
    
    let currentSection = 'main';
    
    paragraphs.forEach((p) => {
      const text = p.textContent || '';
      const htmlContent = p.innerHTML || '';
      
      // Check if paragraph contains Design Inspiration header
      if (htmlContent.includes('<strong>Design Inspiration:</strong>') || text.includes('Design Inspiration:')) {
        currentSection = 'design';
        const designText = text.replace('Design Inspiration:', '').trim();
        if (designText) {
          sections.designInspiration = designText;
        }
      } else if (htmlContent.includes('<strong>Features:</strong>') || text.includes('Features:')) {
        currentSection = 'features';
      } else if (htmlContent.includes('<strong>Why Choose') || text.includes('Why Choose')) {
        currentSection = 'why';
        const whyText = text.replace(/Why Choose.*?:/, '').trim();
        if (whyText) {
          sections.whyChoose = whyText;
        }
      } else if (text.includes('Perfect For:')) {
        currentSection = 'perfect';
      } else if (text.includes('Pair them with') || text.includes('Pair it with')) {
        sections.pairWith = text.trim();
      } else if (currentSection === 'design' && !text.includes(':')) {
        sections.designInspiration += ' ' + text;
      } else if (currentSection === 'why' && !text.includes('Perfect For:')) {
        sections.whyChoose += ' ' + text;
      }
    });
    
    // Extract features and perfect for items
    lists.forEach((ul) => {
      const items = ul.querySelectorAll('li');
      const previousText = ul.previousElementSibling?.textContent || '';
      
      if (previousText.includes('Features:')) {
        items.forEach(li => {
          const text = li.textContent?.trim() || '';
          if (text && !text.includes('Model wears')) {
            sections.features.push(text);
          }
        });
      } else if (previousText.includes('Perfect For:')) {
        items.forEach(li => {
          const text = li.textContent?.trim() || '';
          if (text) {
            sections.perfectFor.push(text);
          }
        });
      }
    });
    
    // Extract bullet points from paragraphs if lists are not available
    paragraphs.forEach((p) => {
      const text = p.innerHTML;
      
      // Check if this paragraph contains bullet points
      if (text.includes('•')) {
        // Check if we should treat these as features
        const isFeaturesList = text.includes('100%') || text.includes('cotton') || text.includes('Premium') || 
                              text.includes('Quality') || text.includes('Fabric') || text.includes('weight');
        
        if (isFeaturesList || currentSection === 'features') {
          // Split by <br> first to handle multi-line bullet lists
          const lines = text.split(/<br\s*\/?>/);
          lines.forEach(line => {
            if (line.includes('•')) {
              const items = line.split('•').filter(item => item.trim());
              items.forEach(item => {
                const cleanItem = item.replace(/<[^>]*>/g, '').trim();
                if (cleanItem && !cleanItem.includes('Features:') && cleanItem.length > 0) {
                  // Add to features if not already there
                  if (!sections.features.includes(cleanItem)) {
                    sections.features.push(cleanItem);
                  }
                }
              });
            }
          });
        }
      }
    });
    
    return sections;
  };

  // Parse description on client side only to avoid hydration mismatch
  useEffect(() => {
    if (fullDescription) {
      console.log('ProductDetailsSection received fullDescription:', fullDescription.substring(0, 200) + '...');
      const parsedSections = parseDescription(fullDescription);
      console.log('Parsed sections:', parsedSections);
      setSections(parsedSections);
    }
  }, [fullDescription]);
  
  // Count how many sections have content
  const sectionsWithContent = [
    sections.designInspiration,
    sections.features.length > 0,
    sections.whyChoose,
    sections.perfectFor.length > 0
  ].filter(Boolean).length;

  return (
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black font-bodoni">Product Details</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every piece tells a story of heritage reimagined through modern design
          </p>
        </motion.div>
        
        {/* Show message when no content is parsed */}
        {sectionsWithContent === 0 && fullDescription && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-lg shadow-xl border border-gray-100 max-w-4xl mx-auto"
          >
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: fullDescription }} />
            </div>
          </motion.div>
        )}
        
        <div className={`grid ${sectionsWithContent === 1 ? 'grid-cols-1' : 'md:grid-cols-2'} gap-12`}>
          {/* Design Inspiration */}
          {sections.designInspiration && (
            <motion.div 
              className={`bg-white p-8 rounded-lg shadow-xl border border-gray-100 ${sectionsWithContent === 1 ? 'max-w-4xl mx-auto w-full' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                  <Shirt className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-black font-bodoni">Design Inspiration</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">
                {sections.designInspiration}
              </p>
            </motion.div>
          )}
          
          {/* Key Features */}
          {sections.features.length > 0 && (
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-black font-bodoni">Key Features</h3>
              </div>
              <ul className="space-y-3">
                {sections.features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-2 h-2 bg-black rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                    <span className="leading-relaxed">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
          
          {/* Why Choose */}
          {sections.whyChoose && (
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                  <Heart className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-black font-bodoni">Why Choose This</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">
                {sections.whyChoose}
              </p>
            </motion.div>
          )}
          
          {/* Perfect For */}
          {sections.perfectFor.length > 0 && (
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-xl border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-black font-bodoni">Perfect For</h3>
              </div>
              <ul className="space-y-3">
                {sections.perfectFor.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-start text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-2 h-2 bg-black rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
        
        {/* Pair With Section */}
        {sections.pairWith && (
          <motion.div 
            className="mt-12 bg-black text-white p-8 rounded-lg shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4 font-bodoni">Complete Your Look</h3>
              <p className="text-gray-200 leading-relaxed">
                {sections.pairWith}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}