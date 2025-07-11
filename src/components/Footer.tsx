import Link from 'next/link';

const Footer = () => (
  <footer className="relative overflow-hidden" style={{ backgroundColor: '#D4C4A8' }}>
    {/* Top Section - Links and Brand Info */}
    <div className="relative z-10 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black font-playfair-display uppercase text-amber-900">Modern Arab Apparel</h3>
            <p className="text-amber-800 leading-relaxed font-barlow-condensed">
              Reclaiming the narrative through authentic Arabic culture and contemporary design. 
              Made with purpose in Los Angeles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-amber-900 rounded-full flex items-center justify-center hover:bg-amber-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-amber-900 rounded-full flex items-center justify-center hover:bg-amber-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.755-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-amber-900 rounded-full flex items-center justify-center hover:bg-amber-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black font-playfair-display uppercase text-amber-900">Collections</h3>
            <div className="space-y-3">
              <Link href="/products" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">All Products</Link>
              <Link href="/products?category=tees" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">T-Shirts</Link>
              <Link href="/products?category=hoodies" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Hoodies</Link>
              <Link href="/products?category=headwear" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Headwear</Link>
              <Link href="/products?category=bottoms" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Bottoms</Link>
              <Link href="/products/modern-arab-faded-tee" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Signature Tee</Link>
            </div>
            <div className="pt-4 space-y-3">
              <Link href="/about-us" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">About Us</Link>
              <Link href="/contact" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Contact</Link>
            </div>
          </div>

          {/* Support Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black font-playfair-display uppercase text-amber-900">Support</h3>
            <div className="space-y-3">
              <Link href="/faqs#size-guide" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Size Guide</Link>
              <Link href="/faqs#shipping" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Shipping & Returns</Link>
              <Link href="/faqs#care" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">Care Instructions</Link>
              <Link href="/faqs" className="block text-amber-800 hover:text-amber-900 transition-colors font-barlow-condensed">FAQ</Link>
            </div>
          </div>
        </div>

      </div>
    </div>

    {/* Middle Section - Large Engraved Arabic Text (no overlapping content) */}
    <div className="relative py-40 overflow-visible">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center select-none w-full px-4">
          <div 
            className="font-black font-playfair-display leading-none whitespace-nowrap"
            style={{ 
              fontSize: 'clamp(6rem, 15vw, 20rem)',
              color: '#7b3306',
              textShadow: `
                inset 0 0 0 1px rgba(0,0,0,0.5),
                inset 2px 2px 4px rgba(0,0,0,0.8),
                inset -2px -2px 4px rgba(255,255,255,0.3),
                0 1px 0 rgba(255,255,255,0.6),
                0 2px 2px rgba(0,0,0,0.4),
                0 4px 8px rgba(0,0,0,0.3),
                0 0 20px rgba(0,0,0,0.2)
              `,
              lineHeight: '1.2',
              filter: 'contrast(1.2) brightness(0.9)'
            }}
          >
            ألآ تخافون من الله
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Section - Arabic Message Description and Copyright */}
    <div className="relative z-10 pt-12 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Arabic Message Section */}
        <div className="text-center border-t border-amber-700 pt-12 mb-12">
          <div className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-amber-900 font-playfair-display leading-none">
            ألآ تخافون من الله
          </div>
          <p className="text-xl md:text-2xl text-amber-700 max-w-4xl mx-auto leading-relaxed font-barlow-condensed">
&quot;Don&apos;t you fear God?&quot; - A powerful rhetorical question that transcends fear, 
            inspiring reflection and spiritual accountability through authentic Arabic calligraphy.
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-amber-700 pt-8">
          <p className="text-amber-700 font-barlow-condensed">
            © 2024 Modern Arab Apparel. All rights reserved. | Designed in Los Angeles with authentic Arabic culture.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;