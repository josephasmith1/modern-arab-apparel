import Image from 'next/image';
import Link from 'next/link';
import { products } from '../../products/data';
import Footer from '@/components/Footer';

export default function HoodiesPage() {
  // Filter for Hoodies and Sweatshirts only
  const hoodieProducts = [
    ...products.filter(p => 
      p.name.toLowerCase().includes('hoodie') || 
      p.name.toLowerCase().includes('crewneck')
    )
  ];

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
            Hoodies & Sweatshirts
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-barlow-condensed">
            Premium hoodies and sweatshirts featuring Modern Arab branding. 
            Perfect for layering and everyday comfort.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/collections/all" className="bg-white text-black border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
            All Products
          </Link>
          <Link href="/collections/t-shirts" className="bg-white text-black border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
            T-Shirts
          </Link>
          <Link href="/collections/hoodies" className="bg-black text-white px-6 py-3 rounded-lg font-semibold">
            Hoodies
          </Link>
          <Link href="/collections/accessories" className="bg-white text-black border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
            Accessories
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hoodieProducts.map((product) => (
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
                    {product.description || "Premium hoodie featuring Modern Arab branding and superior comfort."}
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

        {/* Hoodie Features */}
        <div className="mt-20 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-light mb-8 text-center text-black font-bodoni">Hoodie Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c2.21 0 4 1.79 4 4 0 .89-.29 1.71-.78 2.38C16.33 8.75 17 9.8 17 11c0 2.21-1.79 4-4 4s-4-1.79-4-4c0-1.2.67-2.25 1.78-2.62C10.29 7.71 10 6.89 10 6c0-2.21 1.79-4 2-4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Premium Fleece</h3>
              <p className="text-gray-600 font-barlow-condensed">
                Premium fleece material for ultimate comfort and warmth 
                in all seasons.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V7h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">LA Design</h3>
              <p className="text-gray-600 font-barlow-condensed">
                Designed in Los Angeles, bridging heritage with hometown identity 
                for the modern Arab experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Relaxed Fit</h3>
              <p className="text-gray-600 font-barlow-condensed">
                Relaxed unisex fit with comfortable drawstring hood 
                and kangaroo pocket for everyday wear.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}