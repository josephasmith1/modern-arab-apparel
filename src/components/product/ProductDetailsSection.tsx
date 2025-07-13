import React from 'react';
import { motion } from 'framer-motion';
import { Shirt, Heart, Users, Package } from 'lucide-react';

interface ProductDetailsSectionProps {
  fullDescription: string;
}

export default function ProductDetailsSection({ fullDescription }: ProductDetailsSectionProps) {
  // Parse the HTML description to extract sections
  const parseDescription = (html: string) => {
    // Skip parsing on server side
    if (typeof window === 'undefined') {
      return {
        mainDescription: '',
        designInspiration: '',
        features: [] as string[],
        whyChoose: '',
        perfectFor: [] as string[],
        pairWith: ''
      };
    }
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
    
    let currentSection = 'main';
    
    paragraphs.forEach((p) => {
      const text = p.textContent || '';
      const htmlContent = p.innerHTML || '';
      
      // Check if paragraph contains Design Inspiration header
      if (htmlContent.includes('<strong>Design Inspiration:</strong>')) {
        // Extract the content after the strong tag
        const designMatch = htmlContent.match(/<strong>Design Inspiration:<\/strong>(.+)/);
        if (designMatch) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = designMatch[1];
          sections.designInspiration = tempDiv.textContent?.trim() || '';
        }
        currentSection = 'design';
      } else if (text.includes('Design Inspiration:')) {
        currentSection = 'design';
        sections.designInspiration = text.replace('Design Inspiration:', '').trim();
      } else if (htmlContent.includes('<strong>Features:</strong>')) {
        currentSection = 'features';
      } else if (text.includes('Features:')) {
        currentSection = 'features';
      } else if (htmlContent.includes('<strong>Why Choose')) {
        currentSection = 'why';
        sections.whyChoose = text.trim();
      } else if (text.includes('Why Choose')) {
        currentSection = 'why';
        sections.whyChoose = text.trim();
      } else if (text.includes('Perfect For:')) {
        currentSection = 'perfect';
      } else if (text.includes('Pair them with') || text.includes('Pair it with')) {
        sections.pairWith = text.trim();
      } else if (currentSection === 'main' && !text.includes('•')) {
        sections.mainDescription += text + ' ';
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
      
      // Check if this paragraph follows the Features header and contains bullet points
      if (text.includes('•') && (currentSection === 'features' || text.includes('<strong>Features:</strong>'))) {
        // Split by <br> first to handle multi-line bullet lists
        const lines = text.split(/<br\s*\/?>/);
        lines.forEach(line => {
          if (line.includes('•')) {
            const items = line.split('•').filter(item => item.trim());
            items.forEach(item => {
              const cleanItem = item.replace(/<[^>]*>/g, '').trim();
              if (cleanItem && !cleanItem.includes('Features:') && cleanItem.length > 0) {
                sections.features.push(cleanItem);
              }
            });
          }
        });
      }
    });
    
    return sections;
  };

  const sections = parseDescription(fullDescription);
  
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