import React from 'react';
import { Shirt, Feather, MapPin, Sparkles } from 'lucide-react';

type CraftmanshipDetailsProps = {
  inspiration: string;
  features: string[];
  perfectFor: string[];
  origin: string;
};

export default function CraftmanshipDetails({
  inspiration,
  features,
  perfectFor,
  origin
}: CraftmanshipDetailsProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-semibold mb-8 text-center text-black">Craftmanship Details</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Shirt className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Design Inspiration</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{inspiration}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Feather className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Key Features</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <Sparkles className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Perfect For</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              {perfectFor.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 mr-2 text-gray-700" />
              <h3 className="text-xl font-semibold text-black">Origin & Craft</h3>
            </div>
            <p className="text-gray-600">{origin}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
