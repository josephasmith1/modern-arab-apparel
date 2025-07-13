import React from 'react';
import { Tag, Square, Droplets, PackageCheck } from 'lucide-react';

type TechnicalSpecificationsProps = {
  material: string;
  weight: string;
  fit: string;
  additionalSpecs: string[];
};

export default function TechnicalSpecifications({
  material,
  weight,
  fit,
  additionalSpecs
}: TechnicalSpecificationsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-semibold mb-8 text-center text-black">Technical Specifications</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Tag className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Material Composition</h3>
            </div>
            <p className="text-gray-600">{material}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Droplets className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Fabric Weight</h3>
            </div>
            <p className="text-gray-600">{weight}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Square className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Fit & Style</h3>
            </div>
            <p className="text-gray-600">{fit}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <PackageCheck className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Additional Specifications</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              {additionalSpecs.map((spec, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
