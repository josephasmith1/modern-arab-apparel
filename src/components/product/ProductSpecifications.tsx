'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Package2, MapPin, Info, Shirt, Droplets, Square, Tag } from 'lucide-react';

interface ProductSpecificationsProps {
  fullDescription: string;
}

interface Specification {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export default function ProductSpecifications({ fullDescription }: ProductSpecificationsProps) {
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [sizeGuide, setSizeGuide] = useState({
    hasTable: false,
    imperial: '',
    metric: ''
  });
  const [disclaimer, setDisclaimer] = useState('');

  // Parse technical specifications from the HTML description
  const parseSpecifications = (html: string): Specification[] => {
    const specs: Specification[] = [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Find all paragraphs with bullet points
    const paragraphs = tempDiv.querySelectorAll('p');
    const technicalSpecs: string[] = [];
    
    paragraphs.forEach((p) => {
      const text = p.innerHTML;
      // Look for technical specs (usually after features and starting with •)
      if (text.includes('•') && (
        text.includes('cotton') || 
        text.includes('polyester') || 
        text.includes('weight:') || 
        text.includes('oz.') ||
        text.includes('sourced from') ||
        text.includes('printed in')
      )) {
        const items = text.split('•').filter(item => item.trim());
        items.forEach(item => {
          const cleanItem = item.replace(/<[^>]*>/g, '').trim();
          if (cleanItem) {
            technicalSpecs.push(cleanItem);
          }
        });
      }
    });
    
    // Map specifications to structured data
    technicalSpecs.forEach(spec => {
      const lowerSpec = spec.toLowerCase();
      
      // Material composition
      if (lowerSpec.includes('cotton') || lowerSpec.includes('polyester') || lowerSpec.includes('blend')) {
        if (!specs.find(s => s.label === 'Material Composition')) {
          specs.push({
            label: 'Material Composition',
            value: spec,
            icon: <Shirt className="w-5 h-5" strokeWidth={1.5} />
          });
        }
      }
      
      // Fabric weight
      else if (lowerSpec.includes('weight:') || lowerSpec.includes('oz.')) {
        specs.push({
          label: 'Fabric Weight',
          value: spec,
          icon: <Droplets className="w-5 h-5" strokeWidth={1.5} />
        });
      }
      
      // Garment treatment
      else if (lowerSpec.includes('garment-dyed') || lowerSpec.includes('pre-shrunk')) {
        specs.push({
          label: 'Treatment',
          value: spec,
          icon: <Package2 className="w-5 h-5" strokeWidth={1.5} />
        });
      }
      
      // Fit
      else if (lowerSpec.includes('fit') || lowerSpec.includes('oversized') || lowerSpec.includes('relaxed')) {
        specs.push({
          label: 'Fit & Style',
          value: spec,
          icon: <Square className="w-5 h-5" strokeWidth={1.5} />
        });
      }
      
      // Design details
      else if (lowerSpec.includes('shoulders') || lowerSpec.includes('neck') || lowerSpec.includes('ribbing') || lowerSpec.includes('cuffs')) {
        specs.push({
          label: 'Design Details',
          value: spec,
          icon: <Ruler className="w-5 h-5" strokeWidth={1.5} />
        });
      }
      
      // Manufacturing
      else if (lowerSpec.includes('sourced from') || lowerSpec.includes('blank product')) {
        specs.push({
          label: 'Sourcing',
          value: spec,
          icon: <MapPin className="w-5 h-5" strokeWidth={1.5} />
        });
      }
      
      else if (lowerSpec.includes('printed in') || lowerSpec.includes('designed in') || lowerSpec.includes('final product')) {
        specs.push({
          label: 'Production',
          value: spec,
          icon: <MapPin className="w-5 h-5" strokeWidth={1.5} />
        });
      }
      
      // Other specifications
      else if (lowerSpec.includes('label') || lowerSpec.includes('tag')) {
        specs.push({
          label: 'Additional Features',
          value: spec,
          icon: <Tag className="w-5 h-5" strokeWidth={1.5} />
        });
      }
      
      // Catch-all for other technical specs
      else if (spec.length > 5) {
        specs.push({
          label: 'Specification',
          value: spec,
          icon: <Info className="w-5 h-5" strokeWidth={1.5} />
        });
      }
    });
    
    return specs;
  };

  // Extract size guide from HTML
  const extractSizeGuide = (html: string) => {
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const tables = tempDiv.querySelectorAll('table');
    const imperialTable = tempDiv.querySelector('[data-unit-system="imperial"] table');
    const metricTable = tempDiv.querySelector('[data-unit-system="metric"] table');
    
    return {
      hasTable: tables.length > 0,
      imperial: imperialTable?.outerHTML || '',
      metric: metricTable?.outerHTML || ''
    };
  };

  // Extract disclaimer
  const extractDisclaimer = (html: string): string => {
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const paragraphs = tempDiv.querySelectorAll('p');
    let disclaimer = '';
    
    paragraphs.forEach((p) => {
      const text = p.textContent || '';
      if (text.includes('Disclaimer:') || text.includes('runs small') || text.includes('runs large') || text.includes('recommend ordering')) {
        disclaimer = text;
      }
    });
    
    return disclaimer;
  };

  useEffect(() => {
    // Only run parsing on client side
    if (typeof window !== 'undefined') {
      setSpecifications(parseSpecifications(fullDescription));
      setSizeGuide(extractSizeGuide(fullDescription));
      setDisclaimer(extractDisclaimer(fullDescription));
    }
  }, [fullDescription]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black font-bodoni">
            Technical Specifications
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium quality meets thoughtful design in every detail
          </p>
        </motion.div>
        
        {/* Specifications Masonry */}
        {specifications.length > 0 && (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 mb-16 space-y-6">
            {specifications.map((spec, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-black transition-all duration-300 break-inside-avoid mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <div className="text-white">
                      {spec.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                      {spec.label}
                    </h3>
                    <p className="text-gray-800 text-base leading-relaxed">
                      {spec.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Size Guide Section */}
        {sizeGuide.hasTable && (
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-8 text-center text-black font-bodoni">
              Size Guide
            </h3>
            
            {disclaimer && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
                <p className="text-amber-800 text-center font-medium">
                  {disclaimer}
                </p>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Imperial Size Guide */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-4 text-gray-700">Imperial (Inches)</h4>
                  <div 
                    className="size-guide-imperial [&>table]:w-full [&>table]:border-collapse [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-300 [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:text-center [&>table>tbody>tr:first-child>td]:bg-gray-100 [&>table>tbody>tr:first-child>td]:font-semibold [&>table>tbody>tr>td:first-child]:font-semibold [&>table>tbody>tr>td:first-child]:bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: sizeGuide.imperial }}
                  />
                </div>
                
                {/* Metric Size Guide */}
                <div>
                  <h4 className="text-lg font-medium mb-4 text-gray-700">Metric (Centimeters)</h4>
                  <div 
                    className="size-guide-metric [&>table]:w-full [&>table]:border-collapse [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-gray-300 [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:text-center [&>table>tbody>tr:first-child>td]:bg-gray-100 [&>table>tbody>tr:first-child>td]:font-semibold [&>table>tbody>tr>td:first-child]:font-semibold [&>table>tbody>tr>td:first-child]:bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: sizeGuide.metric }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Care Instructions */}
        <motion.div 
          className="bg-gray-50 rounded-lg p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-6 text-center text-black font-bodoni">
            Care Instructions
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-gray-800">Washing</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Machine wash cold with like colors</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Gentle cycle recommended</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Do not bleach</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-gray-800">Drying & Care</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tumble dry low or hang dry</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Iron on low heat if needed</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Do not dry clean</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}