"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Package, RotateCcw, Info, Heart, Globe, Shirt } from 'lucide-react';
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cultural': return <Heart className="w-4 h-4" />;
      case 'Product': return <Shirt className="w-4 h-4" />;
      case 'Shipping': return <Package className="w-4 h-4" />;
      case 'Returns': return <RotateCcw className="w-4 h-4" />;
      case 'Care': return <Info className="w-4 h-4" />;
      case 'Ethics': return <Globe className="w-4 h-4" />;
      case 'Brand': return <Heart className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* Hero Section - Magazine Style */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase font-barlow-condensed">
              Support & Information
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-light font-bodoni mb-8 text-black leading-none">
            FAQs
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-barlow-condensed">
            Find answers to common questions about our products, shipping, and cultural significance. 
            Everything you need to know about Modern Arab Apparel.
          </p>
        </motion.div>

        {/* Category Filter - Magazine Style */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white p-8 rounded shadow-sm max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="text-lg font-light font-bodoni text-black mb-2">Browse by Category</h3>
              <p className="text-sm text-gray-600 font-barlow-condensed">Filter questions by topic to find what you're looking for</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-300 font-barlow-condensed ${
                    activeCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category !== 'All' && (
                    <span className={activeCategory === category ? 'text-white' : 'text-gray-500'}>
                      {getCategoryIcon(category)}
                    </span>
                  )}
                  <span>{category}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ List - Magazine Style */}
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="bg-white shadow-sm border border-gray-200 hover:border-black transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
              >
                <motion.button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ backgroundColor: '#f9fafb' }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full font-barlow-condensed bg-gray-100 text-gray-700">
                          {getCategoryIcon(faq.category)}
                          <span>{faq.category}</span>
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-light text-black font-bodoni leading-tight">
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </div>
                </motion.button>
                
                <AnimatePresence>
                  {openFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6">
                        <div className="border-t border-gray-200 pt-6">
                          <p className="text-gray-700 leading-relaxed text-lg font-barlow-condensed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contact Section - Magazine Style */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-black text-white p-12 lg:p-16 relative overflow-hidden">
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <div className="mb-6">
                <span className="text-xs font-bold tracking-widest text-gray-400 uppercase font-barlow-condensed">
                  Get in Touch
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-light font-bodoni mb-6 text-white">Still Have Questions?</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-barlow-condensed">
                Can't find the answer you're looking for? Our team is here to help with any 
                questions about our products, culture, or brand story.
              </p>
              <div className="flex flex-col lg:flex-row gap-6 justify-center max-w-md mx-auto lg:max-w-none">
                <motion.a
                  href="/contact"
                  className="flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 font-semibold hover:bg-gray-100 transition-colors duration-300 font-barlow-condensed tracking-wide"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>CONTACT US</span>
                </motion.a>
                <motion.a
                  href="mailto:hello@modernarabapparel.com"
                  className="flex items-center justify-center space-x-2 border border-white text-white px-8 py-4 font-semibold hover:bg-white hover:text-black transition-colors duration-300 font-barlow-condensed tracking-wide"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="w-4 h-4" />
                  <span>EMAIL SUPPORT</span>
                </motion.a>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 opacity-5">
              <div className="text-8xl font-bodoni text-white transform rotate-12">
                ?
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links - Magazine Grid */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="text-xs font-bold tracking-widest text-gray-500 uppercase font-barlow-condensed">
                Quick Access
              </span>
            </div>
            <h3 className="text-3xl md:text-4xl font-light font-bodoni text-black mb-4">Related Information</h3>
            <p className="text-lg text-gray-600 font-barlow-condensed">Essential information about our policies and services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="group bg-white hover:bg-black transition-all duration-500 p-8 text-center shadow-sm border border-gray-200 hover:border-black"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Package className="w-8 h-8 text-white group-hover:text-black transition-colors" />
              </motion.div>
              <h3 className="text-xl font-light font-bodoni mb-3 text-black group-hover:text-white transition-colors">Shipping Information</h3>
              <p className="text-gray-600 group-hover:text-gray-300 transition-colors font-barlow-condensed">
                Learn about our shipping methods, times, and costs for domestic and international orders.
              </p>
            </motion.div>

            <motion.div 
              className="group bg-white hover:bg-black transition-all duration-500 p-8 text-center shadow-sm border border-gray-200 hover:border-black"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <RotateCcw className="w-8 h-8 text-white group-hover:text-black transition-colors" />
              </motion.div>
              <h3 className="text-xl font-light font-bodoni mb-3 text-black group-hover:text-white transition-colors">Returns & Exchanges</h3>
              <p className="text-gray-600 group-hover:text-gray-300 transition-colors font-barlow-condensed">
                30-day return policy with easy exchange process. Quality guaranteed.
              </p>
            </motion.div>

            <motion.div 
              className="group bg-white hover:bg-black transition-all duration-500 p-8 text-center shadow-sm border border-gray-200 hover:border-black"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-black group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <Info className="w-8 h-8 text-white group-hover:text-black transition-colors" />
              </motion.div>
              <h3 className="text-xl font-light font-bodoni mb-3 text-black group-hover:text-white transition-colors">Size Guide</h3>
              <p className="text-gray-600 group-hover:text-gray-300 transition-colors font-barlow-condensed">
                Find your perfect fit with our detailed size charts and fitting tips.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}