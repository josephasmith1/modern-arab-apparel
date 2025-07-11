import Image from 'next/image';
import Link from 'next/link';
import comprehensiveProducts from '../../../../data/comprehensive-products.json';
import Footer from '@/components/Footer';

export default function LegwearPage() {
  // Filter for Bottoms/Legwear only
  const legwearProducts = comprehensiveProducts.filter(p => 
    p.category === "Bottoms" || 
    p.name.toLowerCase().includes('jogger') || 
    p.name.toLowerCase().includes('sweatpants') || 
    p.name.toLowerCase().includes('pants')
  );

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
            Legwear
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-barlow-condensed">
            Step into effortless style with Modern Arab legwear—where comfort meets culture. 
            Designed for a modern fit with a discreet Arabic-inspired touch, these joggers and 
            sweatpants blend heritage with contemporary streetwear.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {legwearProducts.map((product) => (
            <div key={product.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={('colors' in product && product.colors && product.colors[0]?.images?.main) || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 font-barlow-condensed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-black">
                      {product.price}
                    </span>
                    <div className="flex items-center text-black group-hover:text-gray-700 transition-colors">
                      <span className="text-sm font-medium mr-2">View</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {legwearProducts.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-light mb-4 text-gray-600">Coming Soon</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Our legwear collection is being prepared. Check back soon for premium joggers, 
              sweatpants, and other bottom wear that combines comfort with cultural expression.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}