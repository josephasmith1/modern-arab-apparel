"use client";

import { useState } from 'react';
import Footer from '@/components/Footer';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "What does 'ألآ تخافون من الله' mean?",
    answer: "This Arabic phrase translates to 'Don't you fear God?' It's a powerful rhetorical question from Islamic tradition that encourages spiritual reflection and accountability. It's not meant to instill fear, but rather to inspire consciousness of one's actions and spiritual responsibility.",
    category: "Cultural"
  },
  {
    id: 2,
    question: "Are your Arabic designs authentic?",
    answer: "Yes, absolutely. Our Arabic calligraphy is designed by first-generation and native Arabic speakers to ensure cultural authenticity and respect. We work closely with cultural consultants to make sure our designs honor the language and its meaning.",
    category: "Cultural"
  },
  {
    id: 3,
    question: "What materials are your clothes made from?",
    answer: "We use premium materials including 100% carded cotton for our tees, with a weight of 7.1 oz./yd² (240 g/m²). All our garments are pre-shrunk and garment-dyed for durability and comfort. We prioritize quality and sustainability in our material choices.",
    category: "Product"
  },
  {
    id: 4,
    question: "How do your sizes fit?",
    answer: "Our clothing features a boxy, oversized fit with dropped shoulders and wide neck ribbing. We recommend checking our size guide for specific measurements. Our unisex sizing runs true to size for the oversized aesthetic we're aiming for.",
    category: "Product"
  },
  {
    id: 5,
    question: "Do you offer international shipping?",
    answer: "Currently, we primarily ship within the United States. We're working on expanding our international shipping options. Please contact us at hello@modernarabapparel.com for specific international shipping inquiries.",
    category: "Shipping"
  },
  {
    id: 6,
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unworn items in original condition with tags attached. Items must be returned within 30 days of purchase. We provide free return shipping labels for domestic returns.",
    category: "Returns"
  },
  {
    id: 7,
    question: "How should I care for my Modern Arab Apparel?",
    answer: "Machine wash cold with like colors, do not bleach, tumble dry low, and iron inside out on low heat if needed. This will help maintain the quality and longevity of your garment.",
    category: "Care"
  },
  {
    id: 8,
    question: "Are your products ethically made?",
    answer: "Yes, we're committed to ethical manufacturing. Our blank products are responsibly sourced, and final design and printing are done in the USA. We prioritize fair labor practices and sustainable production methods.",
    category: "Ethics"
  },
  {
    id: 9,
    question: "Can I customize or personalize items?",
    answer: "Currently, we don't offer customization services as each design is carefully crafted with specific cultural and artistic intentions. However, we're always developing new designs - follow us on social media for updates on new releases.",
    category: "Product"
  },
  {
    id: 10,
    question: "What inspired the creation of Modern Arab Apparel?",
    answer: "Modern Arab Apparel was born from the desire to challenge stereotypes and celebrate authentic Arab culture. We believe Arabs are not what the world thinks they are—they are better. Our mission is to bridge heritage with hometown identity through meaningful fashion.",
    category: "Brand"
  },
  {
    id: 11,
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 5-7 business days within the United States. We offer free shipping on orders over $50. You'll receive tracking information once your order ships.",
    category: "Shipping"
  },
  {
    id: 12,
    question: "Do you restock sold-out items?",
    answer: "We do our best to restock popular items, but some designs may be limited edition. Sign up for our newsletter or follow us on social media to be notified about restocks and new releases.",
    category: "Product"
  }
];

const categories = ["All", "Product", "Cultural", "Shipping", "Returns", "Care", "Ethics", "Brand"];

export default function FAQsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const filteredFAQs = activeCategory === "All" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-black">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Find answers to common questions about our products, shipping, and cultural significance.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-black pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          openFAQ === faq.id ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                {openFAQ === faq.id && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-4 text-black">Still Have Questions?</h2>
            <p className="text-gray-700 mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
              >
                Contact Us
              </a>
              <a
                href="mailto:hello@modernarabapparel.com"
                className="border border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors duration-200"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Shipping Information</h3>
              <p className="text-gray-600 text-sm">
                Learn about our shipping methods, times, and costs.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Returns & Exchanges</h3>
              <p className="text-gray-600 text-sm">
                30-day return policy with easy exchange process.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Size Guide</h3>
              <p className="text-gray-600 text-sm">
                Find your perfect fit with our detailed size charts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}