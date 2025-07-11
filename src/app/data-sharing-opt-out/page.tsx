"use client";

import { useState } from 'react';
import Footer from '@/components/Footer';

export default function DataSharingOptOutPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle opt-out submission here
    console.log('Opt-out request:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-black">
            Data Sharing Opt-Out
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your privacy is important to us. Use this form to opt out of data sharing with third parties.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-black mb-6 text-black">Understanding Data Sharing</h2>
          
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 mb-4">
              At Modern Arab Apparel, we respect your privacy and are committed to protecting your personal information. 
              This page allows you to opt out of certain data sharing practices while still enjoying our products and services.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-black">What Data We May Share</h3>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>• Analytics data with marketing partners (aggregated and anonymized)</li>
              <li>• Email marketing preferences with trusted service providers</li>
              <li>• Purchase behavior insights for product development</li>
              <li>• Customer service interactions for quality improvement</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-black">What We Don&apos;t Share</h3>
            <ul className="text-gray-700 space-y-2 mb-6">
              <li>• Personal identifying information (name, address, phone)</li>
              <li>• Payment or financial information</li>
              <li>• Private communications or messages</li>
              <li>• Individual purchase history details</li>
            </ul>
          </div>

          {!isSubmitted ? (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-black">Opt Out of Data Sharing</h3>
              <p className="text-gray-700 mb-4">
                Enter your email address to opt out of data sharing with third parties. 
                This will not affect your ability to shop with us or receive order updates.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
                >
                  Submit Opt-Out Request
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-semibold text-green-800">Opt-Out Request Submitted</h3>
              </div>
              <p className="text-green-700">
                Thank you for your submission. Your opt-out request has been received and will be processed within 48 hours. 
                You will receive a confirmation email at <strong>{email}</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-black mb-4 text-black">Your Rights</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Right to know what personal information is collected</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Right to delete personal information</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Right to opt out of data sharing</span>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Right to non-discrimination for exercising rights</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-black mb-4 text-black">Contact Us</h3>
            <p className="text-gray-700 mb-4">
              Have questions about our privacy practices or need help with your opt-out request?
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                <span className="text-gray-700">privacy@modernarabapparel.com</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span className="text-gray-700">Los Angeles, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-black text-white rounded-lg p-8">
            <h3 className="text-2xl font-black mb-4">Privacy Notice</h3>
            <p className="text-gray-300 leading-relaxed">
              This opt-out applies to data sharing with third parties for marketing and analytics purposes. 
              Essential data sharing for payment processing, order fulfillment, and customer service will continue 
              as necessary to provide our services. For complete details, please review our full Privacy Policy.
            </p>
            <div className="mt-6">
              <a
                href="/privacy-policy"
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Read Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}