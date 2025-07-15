"use client";

import { Sparkles } from 'lucide-react';
import { products } from '@/data/products/sync';

interface ProductDetailsProps {
  product: typeof products[0];
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div>
      {/* Features Section */}
      {product.features && product.features.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-black font-bodoni">Why You&apos;ll Love It</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {product.features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Description & Specifications */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div className="prose prose-xl max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.fullDescription.replace(/\n/g, '<br />') }}></div>
          </div>
          <div className="space-y-6">
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-black">Specifications</h3>
                <div className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]: [string, string]) => (
                    <div key={key} className="flex justify-between border-b border-gray-300 pb-2">
                      <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-medium text-black">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(product.origin || (product.careInstructions && product.careInstructions.length > 0)) && (
              <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-semibold mb-6 text-black">Origin & Care</h3>
                <div className="space-y-4">
                  {product.origin && (
                    <div className="text-gray-700 mb-4">
                      <p className="leading-relaxed">{product.origin}</p>
                    </div>
                  )}
                  {product.careInstructions && product.careInstructions.length > 0 && (
                    <div className="pt-4 border-t border-gray-300">
                      <h4 className="font-semibold mb-3 text-black">Care Instructions:</h4>
                      <ul className="text-gray-600 space-y-2">
                        {product.careInstructions.map((line: string, i: number) => <li key={i}>• {line}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Shipping & Returns */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-black font-bodoni">Our Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Free Shipping</h3>
              <p className="text-gray-600 text-lg">On orders over $50</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-black">30-Day Returns</h3>
              <p className="text-gray-600 text-lg">Easy returns & exchanges</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold mb-4 text-black">Our Promise: Your Satisfaction Isn&apos;t Just a Goal—It&apos;s Our Guarantee.</h2>
              <p className="text-gray-600 text-lg">Crafted with care in the USA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
