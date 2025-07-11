import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="text-black font-barlow-condensed" style={{ backgroundColor: '#f0edec' }}>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/product-images/IMG_3487_085f7aae-632c-4e09-9321-1c5aad742324_750x.webp"
            alt="Modern Arab Apparel"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-6xl md:text-8xl font-black mb-4 text-white drop-shadow-2xl font-playfair-display uppercase">
              The Story
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg font-my-soul">
              We are Modern Arab, and this is the narrative.
            </p>
          </div>
        </div>
      </section>

      {/* About Modern Arab Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center font-playfair-display uppercase">About Modern Arab</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
            <div className="lg:col-span-2">
              <p className="text-xl leading-relaxed mb-6">
                Los Angeles original, Arab American Premium Wear Apparel Brand.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                A one hundred percent original brand, Modern Arab is determined to change the narrative about Arabs today through western style premium wear. We believe in cultural pride, inclusion, and storytelling through fashion. Every piece we create is designed to inspire conversation, challenge outdated narratives, and empower individuals to wear their Arabic heritage with confidence.
              </p>
            </div>
            <div className="relative h-[500px]">
              <Image
                src="/product-images/91E379F9-711A-4065-AE1F-92F98E3362E7-2_750x.webp"
                alt="Modern Arab Fashion"
                fill
                className="object-cover object-top rounded-lg shadow-2xl"
              />
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Modern Arab&apos;s commitment is to define Arab identity through fashion. As we remove radical stereotypes with Arabic inspired apparel, we change the narrative about Arabic speaking people on the global scale. We are bridging cultures by encouraging the right conversations and invite dialogue for inclusion, culture, and belonging.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20" style={{ backgroundColor: 'rgba(240, 237, 236, 0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="relative h-[500px]">
              <Image
                src="/product-images/9D0D7091-2A2E-4DFE-932A-2B0524728C37-2_750x.webp"
                alt="Our Mission"
                fill
                className="object-cover object-top rounded-lg shadow-2xl"
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-4xl md:text-5xl font-black mb-8 font-playfair-display uppercase">Our Mission</h2>
              <p className="text-lg leading-relaxed mb-6">
                At Modern Arab, we believe that everyone who embraces Arab culture deserves to look their best and feel their safest—unapologetically proud and authentically themselves. That belief sparked our journey to challenge misconceptions and create a space where modern fashion meets cultural heritage.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                By blending style with purpose, we reveal the true essence of Arab identity—one of peace, faith, and cultural richness—while breaking harmful stereotypes along the way.
              </p>
              <p className="text-lg leading-relaxed">
                Our mission is simple yet powerful: to redefine Arab representation through premium, trendsetting apparel. Every piece we design is crafted to celebrate inclusivity, individuality, and the beauty of a multicultural world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Width Image Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/product-images/E825F596-F659-492B-B7B0-91E9F2A41B60_750x.webp"
            alt="Modern Arab Movement"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white drop-shadow-2xl font-playfair-display uppercase">
              Not Just Clothing
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 drop-shadow-lg max-w-3xl mx-auto">
              This isn&apos;t just clothing—it&apos;s a statement of identity, confidence, and connection. Welcome to Modern Arab—where culture meets modernity in every stitch.
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center font-playfair-display uppercase">About Us</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <p className="text-lg leading-relaxed mb-6">
                Modern Arab Apparel isn&apos;t just a brand—it&apos;s a movement. Born from the experiences of first-generation Arab Americans, our roots stretch across the diverse landscapes of the Arab world and the dynamic pulse of the West. Through education, work, and travel, we&apos;ve lived the intersection of these cultures, shaping a vision that redefines Arab identity.
              </p>
              <p className="text-lg leading-relaxed">
                At Modern Arab, we challenge outdated narratives that misrepresent Arabic-speaking communities. Our mission is to highlight the beauty, depth, and pride of Arab heritage—bridging the gap between tradition and modernity. This is more than fashion; it&apos;s a statement. Every design tells a story of culture, resilience, and unity. Join us in rewriting the script and celebrating what it truly means to be Modern Arab.
              </p>
            </div>
            <div className="relative h-[500px]">
              <Image
                src="/product-images/MG_0610_e8ce70c1-9773-420d-8417-8c0bf67d38d9_750x.webp"
                alt="About Us"
                fill
                className="object-cover object-top rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20" style={{ backgroundColor: 'rgba(240, 237, 236, 0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="relative h-[500px]">
              <Image
                src="/product-images/IMG_3488_36377c4b-1872-4460-9967-6b9e8d413185_750x.webp"
                alt="Our Story"
                fill
                className="object-cover object-top rounded-lg shadow-2xl"
              />
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-4xl md:text-5xl font-black mb-8 font-playfair-display uppercase">Our Story</h2>
              <p className="text-lg leading-relaxed mb-6">
                Our mission is bold and clear: to redefine Arab identity in today&apos;s world through culture and fashion. Every piece we create tells a story—of heritage, creativity, and unapologetic style.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                At Modern Arab, we challenge stereotypes and shift perspectives, celebrating the beauty, depth, and peaceful presence of Arabic-speaking communities worldwide. To us, being Arab is more than a label—it&apos;s a legacy of resilience, pride, and artistry that deserves to be shared.
              </p>
              <p className="text-lg leading-relaxed font-semibold">
                This is Modern Arab. A movement, a statement, a celebration—one story, one piece at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-12 font-playfair-display uppercase">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <h3 className="text-lg font-black mb-2 font-playfair-display">Diversity</h3>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 className="text-lg font-black mb-2 font-playfair-display">Inclusion</h3>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-black mb-2 font-playfair-display">Sustainability</h3>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-black mb-2 font-playfair-display">Ethics</h3>
            </div>
          </div>

          <p className="text-lg leading-relaxed mb-8">
            At Modern Arab, we embody the spirit of a blended Arab identity in today&apos;s modern world. Our values are rooted in diversity, inclusion, sustainability, and ethical practices—pillars that guide everything we do.
          </p>
          <p className="text-lg leading-relaxed">
            We partner with reliable suppliers who share our commitment to transparency and integrity, ensuring every piece reflects our shared values. Beyond fashion, we&apos;re dedicated to reducing our environmental footprint and creating a positive impact within our communities. Most importantly, we hold our customers at the heart of everything we do, striving to meet their needs with care, quality, and a deep appreciation for their support.
          </p>
        </div>
      </section>

      {/* Our Collections Section */}
      <section className="py-20" style={{ backgroundColor: 'rgba(240, 237, 236, 0.5)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center font-playfair-display uppercase">Our Collections</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
            <div className="lg:col-span-2">
              <p className="text-lg leading-relaxed mb-6">
                Our collections celebrate Arab culture, blending classic and contemporary styles inspired by the diverse heritage of every Arab country. Each piece is thoughtfully curated by our team of fashion experts, ensuring a perfect balance between tradition and modern expression.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                From laid-back casual wear to bold street fashion, we design for everyone across the Arab world. As we grow, we&apos;ll introduce personalized styling services—helping you represent your roots with pride and authenticity.
              </p>
              <p className="text-lg leading-relaxed font-semibold">
                This isn&apos;t just a collection—it&apos;s a tribute to the unity and individuality of Arab identity. Explore the stories where heritage threads into modern style.
              </p>
            </div>
            <div className="relative h-[500px]">
              <Image
                src="/product-images/5BBA9EAF-DA9E-4904-B901-8A1E5CF2FE55-3_750x.webp"
                alt="Our Collections"
                fill
                className="object-cover object-top rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tradition Meets Trend Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <Image
            src="/product-images/3F14D18B-F3ED-443B-A39E-79103E05E1DF_750x.webp"
            alt="Tradition Meets Trend"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white drop-shadow-2xl font-playfair-display uppercase">
              Tradition Meets Trend
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg max-w-3xl mx-auto">
              At Modern Arab, we redefine the ordinary—seamlessly blending Arab heritage with modern style. Every printed design and intricately embroidered piece tells a story, honoring the beauty of Arab culture while embracing contemporary fashion.
            </p>
            <p className="text-lg md:text-xl text-gray-300 drop-shadow-lg max-w-3xl mx-auto">
              Step into a world where heritage evolves into modern expression. Experience the artistry, culture, and craftsmanship woven into every piece.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20" style={{ backgroundColor: '#f0edec' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 font-playfair-display uppercase">Join the Movement</h2>
          <p className="text-xl leading-relaxed mb-12">
            Be part of a community that celebrates authentic Arab culture and challenges misconceptions 
            through powerful, meaningful fashion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/products"
              className="bg-black text-white px-8 py-4 text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-2xl uppercase tracking-wider"
            >
              Shop Collection
            </Link>
            <a 
              href="/contact"
              className="border border-black text-black px-8 py-4 text-lg font-semibold hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}