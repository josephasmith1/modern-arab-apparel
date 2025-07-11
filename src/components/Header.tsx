import Image from 'next/image';
import Link from 'next/link';

const Header = () => (
  <header className="py-4 px-8 flex items-center justify-between backdrop-blur-sm shadow-2xl border-b border-gray-300 sticky top-0 z-50 relative" style={{ backgroundColor: 'rgba(240, 237, 236, 0.95)' }}>
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="text-6xl text-gray-400 opacity-10 font-arabic whitespace-nowrap overflow-hidden">
        ألآ تخافون من الله
      </span>
    </div>
    <div className="flex items-center">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
                src="/product-images/black_transparent_logo_x90@2x.png"
                alt="Modern Arab Apparel Logo"
                width={90}
                height={40}
                className="h-12 w-auto drop-shadow-sm"
            />
        </Link>
    </div>
    <div className="flex items-center space-x-6">
      <nav className="hidden md:flex items-center space-x-6">
        <div className="relative group">
          <Link href="/products" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul text-xl flex items-center">
            Products
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/products" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul">All Products</Link>
            <Link href="/products?category=tees" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul">T-Shirts</Link>
            <Link href="/products?category=hoodies" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul">Hoodies</Link>
            <Link href="/products?category=headwear" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul">Headwear</Link>
            <Link href="/products?category=bottoms" className="block px-4 py-2 text-black hover:bg-gray-100 transition-colors font-my-soul">Bottoms</Link>
          </div>
        </div>
        <Link href="/about-us" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul text-xl">About</Link>
        <Link href="/faqs" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul text-xl">FAQs</Link>
        <Link href="/contact" className="text-black hover:text-gray-600 transition-colors font-medium font-my-soul text-xl">Contact</Link>
      </nav>
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>
        <button className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-colors">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  </header>
);

export default Header;
