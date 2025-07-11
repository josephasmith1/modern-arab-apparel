import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { getCollectionsByCategory } from '@/data/collections';

export default function CollectionsPage() {
  const featuredCollections = getCollectionsByCategory('featured');
  const apparelCollections = getCollectionsByCategory('apparel');
  const accessoryCollections = getCollectionsByCategory('accessories');
  const upcomingCollections = getCollectionsByCategory('upcoming');

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
            Collections
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-barlow-condensed">
            Explore our curated collections of Modern Arab Apparel. 
            Each collection represents our commitment to authentic cultural expression and premium quality.
          </p>
        </div>

        {/* Featured Collection */}
        {featuredCollections.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-light mb-8 text-black font-bodoni">Featured Collection</h2>
            <div className="grid grid-cols-1 gap-8">
              {featuredCollections.map((collection) => (
                <div key={collection.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                  <Link href={`/collections/${collection.slug}`}>
                    <div className="relative h-96 overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        sizes="100vw"
                        priority
                        className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h2 className="text-5xl font-light mb-4 font-bodoni">{collection.name}</h2>
                          <p className="text-xl mb-4 font-barlow-condensed max-w-2xl mx-auto">{collection.description}</p>
                          <span className="text-sm bg-white/20 px-6 py-3 rounded-full">Featured Collection</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apparel Collections */}
        <div className="mb-16">
          <h2 className="text-3xl font-light mb-8 text-black font-bodoni">Apparel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apparelCollections.map((collection) => (
              <div key={collection.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <Link href={`/collections/${collection.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-light mb-2 font-bodoni">{collection.name}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-light mb-3 text-black group-hover:text-gray-700 transition-colors font-bodoni">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600 mb-4 font-barlow-condensed">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-barlow-condensed">Updated {new Date(collection.lastmod).toLocaleDateString()}</span>
                      <div className="flex items-center text-black group-hover:text-gray-700 transition-colors">
                        <span className="text-sm font-medium mr-2">Explore</span>
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
        </div>

        {/* Accessories Collections */}
        <div className="mb-16">
          <h2 className="text-3xl font-light mb-8 text-black font-bodoni">Accessories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {accessoryCollections.map((collection) => (
              <div key={collection.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <Link href={`/collections/${collection.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-2xl font-light mb-2 font-bodoni">{collection.name}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-light mb-3 text-black group-hover:text-gray-700 transition-colors font-bodoni">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600 mb-4 font-barlow-condensed">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-barlow-condensed">Updated {new Date(collection.lastmod).toLocaleDateString()}</span>
                      <div className="flex items-center text-black group-hover:text-gray-700 transition-colors">
                        <span className="text-sm font-medium mr-2">Explore</span>
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
        </div>

        {/* Upcoming Collections */}
        {upcomingCollections.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-light mb-8 text-black font-bodoni">Coming Soon</h2>
            <div className="grid grid-cols-1 gap-8">
              {upcomingCollections.map((collection) => (
                <div key={collection.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                  <Link href={`/collections/${collection.slug}`}>
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        sizes="100vw"
                        className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h3 className="text-3xl font-light mb-2 font-bodoni">{collection.name}</h3>
                          <p className="text-lg font-barlow-condensed">{collection.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Collection */}
        <div className="mt-20 bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4 text-black font-bodoni">Featured: Modern Arab Faded Tee</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-barlow-condensed">
              Our signature piece featuring authentic Arabic calligraphy and premium materials. 
              Available in multiple colorways.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image
                src="/images/modern-arab-faded-tee/faded-khaki-1.jpg"
                alt="Faded Khaki"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                priority
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                Faded Khaki
              </div>
            </div>
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image
                src="/images/modern-arab-faded-tee/faded-black-1.jpg"
                alt="Faded Black"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                Faded Black
              </div>
            </div>
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image
                src="/images/modern-arab-faded-tee/faded-bone-1.jpg"
                alt="Faded Bone"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                Faded Bone
              </div>
            </div>
            <div className="relative h-40 rounded-lg overflow-hidden">
              <Image
                src="/images/modern-arab-faded-tee/faded-green-1.jpg"
                alt="Faded Green"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                Faded Green
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/products/modern-arab-faded-tee"
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}