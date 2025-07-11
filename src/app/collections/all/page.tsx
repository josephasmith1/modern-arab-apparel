import Image from 'next/image';
import Link from 'next/link';
import comprehensiveProducts from '../../../../data/comprehensive-products.json';
import productsJson from '../../../../data/products.json';
import Footer from '@/components/Footer';

export default function AllProductsPage() {
  // Use comprehensive products data
  const allProducts = comprehensiveProducts.map(product => ({
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.colors?.[0]?.images?.main || '/images/modern-arab-faded-tee/faded-khaki-1.jpg',
    colors: product.colors
  }));

  // Remove duplicates based on slug
  const uniqueProducts = allProducts.filter((product, index, self) => 
    index === self.findIndex(p => p.slug === product.slug)
  );

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
            All Products
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-barlow-condensed">
            Discover our complete collection of Modern Arab Apparel. 
            Each piece tells a story of heritage, culture, and contemporary style.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/collections/all" className="bg-black text-white px-6 py-3 rounded-lg font-semibold">
            All Products
          </Link>
          <Link href="/collections/t-shirts" className="bg-white text-black border border-black px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors">
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
          {uniqueProducts.map((product) => (
            <div key={product.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={('image' in product && product.image) || ('colors' in product && product.colors ? product.colors[0].images.main : '/images/placeholder.jpg')}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  {'colors' in product && product.colors && (
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
                    {('description' in product && product.description) || "A statement piece that combines cultural heritage with modern streetwear."}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-black">{product.price}</span>
                      {('originalPrice' in product && product.originalPrice && product.originalPrice !== product.price) && (
                        <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                      )}
                    </div>
                    {'colors' in product && product.colors && (
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
                  
                  {'specifications' in product && product.specifications && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{product.specifications.material}</span>
                        <span>{product.specifications.fit}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-light mb-8 text-center text-black font-bodoni">Why Choose Modern Arab Apparel?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Authentic Design</h3>
              <p className="text-gray-600 font-barlow-condensed">
                Arabic calligraphy designed by first-generation and native speakers 
                for cultural authenticity and respect.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Premium Quality</h3>
              <p className="text-gray-600 font-barlow-condensed">
                100% premium carded cotton with garment-dyed, pre-shrunk fabric 
                for lasting comfort and durability.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V7h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-light mb-3 text-black font-bodoni">Los Angeles Design</h3>
              <p className="text-gray-600 font-barlow-condensed">
                Designed in Los Angeles, bridging heritage with hometown identity 
                for the modern Arab experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}