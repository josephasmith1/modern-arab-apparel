import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black mb-6 text-black">
              About Modern Arab Apparel
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We are more than a clothing brand. We are a movement to reclaim narratives, 
              challenge stereotypes, and celebrate authentic Arab culture through meaningful fashion.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6 text-black">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Modern Arab Apparel was born from a simple yet powerful belief: 
                Arabs are not what the world thinks they are—they are better.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We create clothing that bridges heritage with hometown identity, 
                designed in Los Angeles with authentic Arabic elements created by 
                first-generation and native speakers.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Each piece tells a story of cultural pride, spiritual reflection, 
                and the beauty of modern Arab identity.
              </p>
            </div>
            <div className="bg-black text-white p-8 rounded-lg">
              <h3 className="text-2xl font-black mb-4">Core Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Authentic representation of Arab culture</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Quality craftsmanship and sustainable practices</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Meaningful design with cultural depth</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Challenging stereotypes through fashion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-8 text-black">Our Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Founded in the heart of Los Angeles, Modern Arab Apparel emerged from the 
              desire to create clothing that truly represents the modern Arab experience. 
              We saw a gap in the market for authentic, culturally-rich fashion that 
              speaks to both heritage and contemporary life.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Our flagship piece, the &quot;Don&apos;t Fear God&quot; tee, features the Arabic phrase 
              &quot;ألآ تخافون من الله&quot; - a powerful rhetorical question that transcends fear 
              and inspires spiritual reflection. This isn&apos;t just a design; it&apos;s a 
              conversation starter about faith, conscience, and cultural identity.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Every piece we create is a testament to the beauty, complexity, and 
              richness of Arab culture. We&apos;re not just making clothes - we&apos;re making statements.
            </p>
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-6 text-black">Design Philosophy</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our approach to design is rooted in authenticity, cultural respect, and modern aesthetics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3">Authentic Calligraphy</h3>
              <p className="text-gray-700">
                Our Arabic calligraphy is designed by first-generation and native speakers, 
                ensuring cultural authenticity and respect.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3">Premium Quality</h3>
              <p className="text-gray-700">
                We use only the finest materials and construction techniques to create 
                pieces that last and feel as good as they look.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9l-5.91 6.34L18 22l-6-3.27L6 22l1.91-6.66L2 9l6.91-.74L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3">Meaningful Design</h3>
              <p className="text-gray-700">
                Every element of our designs serves a purpose, carrying cultural 
                significance and personal meaning for the wearer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-8">Making an Impact</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            We believe fashion can be a force for positive change. Through our designs, 
            we aim to educate, inspire, and create connections between cultures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-black mb-3">Cultural Education</h3>
              <p className="text-gray-300">
                Our pieces serve as conversation starters, helping to educate others 
                about Arab culture and values.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-black mb-3">Community Building</h3>
              <p className="text-gray-300">
                We&apos;re building a community of individuals who take pride in their 
                heritage and aren&apos;t afraid to wear it boldly.
              </p>
            </div>
          </div>
          <Link 
            href="/products"
            className="inline-block bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Shop Our Collection
          </Link>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-8 text-black">Join Our Movement</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Be part of a community that celebrates authentic Arab culture and 
            challenges misconceptions through powerful, meaningful fashion.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/contact"
              className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
            >
              Get in Touch
            </Link>
            <Link 
              href="/products"
              className="border border-black text-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-colors duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}