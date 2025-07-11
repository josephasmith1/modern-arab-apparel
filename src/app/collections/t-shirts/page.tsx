import Image from 'next/image';
import Link from 'next/link';
import { products } from '../../products/data';
import Footer from '@/components/Footer';

export default function TShirtsPage() {
  // Filter for T-Shirts only
  const tShirtProducts = [
    ...products.filter(p => 
      p.name.toLowerCase().includes('tee') || 
      p.name.toLowerCase().includes('t-shirt')
    )
  ];

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
            T-Shirts
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-barlow-condensed">
            Discover our premium collection of Modern Arab T-Shirts. 
            Each design features authentic Arabic calligraphy and contemporary styling.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/collections/all" className="bg-white text-black border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
            All Products
          </Link>
          <Link href="/collections/t-shirts" className="bg-black text-white px-6 py-3 rounded-lg font-semibold">
            T-Shirts
          </Link>
          <Link href="/collections/hoodies" className="bg-white text-black border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
            Hoodies
          </Link>
          <Link href="/collections/accessories" className="bg-white text-black border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
            Accessories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tShirtProducts.map((product) => (
            <div key={product.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={product.colors ? product.colors[0].images.main : '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  {product.colors && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-black px-3 py-1 rounded-full text-sm font-medium">
                        {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 font-barlow-condensed">
                    {product.description || "Premium tee featuring authentic Arabic calligraphy and modern design."}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-black">{product.price}</span>
                    </div>
                    {product.colors && (
                      <div className="flex space-x-2">
                        {product.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-600">+{product.colors.length - 3}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* T-Shirt Features */}
        <div className="mt-20 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-light mb-8 text-center text-black font-bodoni">T-Shirt Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4h1.5C18.33 4 19 4.67 19 5.5S18.33 7 17.5 7H16v13H8V7H6.5C5.67 7 5 6.33 5 5.5S5.67 4 6.5 4H8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Premium Cotton</h3>
              <p className="text-gray-600 font-barlow-condensed">
                100% premium carded cotton with garment-dyed, pre-shrunk fabric 
                for lasting comfort and durability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Authentic Calligraphy</h3>
              <p className="text-gray-600 font-barlow-condensed">
                Arabic calligraphy designed by first-generation and native speakers 
                for cultural authenticity and respect.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Unisex Fit</h3>
              <p className="text-gray-600 font-barlow-condensed">
                Boxy, oversized fit with dropped shoulders and wide neck ribbing 
                for comfortable everyday wear.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}