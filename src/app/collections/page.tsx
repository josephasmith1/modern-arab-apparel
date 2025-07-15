import Link from 'next/link';

import Footer from '@/components/Footer';
import { getCollectionsByCategory } from '@/data/collections';
import { getProductsArray } from '@/data/products';
import SafeImage from '@/components/SafeImage';

export default async function CollectionsPage() {
  const featuredCollections = getCollectionsByCategory('featured');
  const apparelCollections = getCollectionsByCategory('apparel');
  const accessoryCollections = getCollectionsByCategory('accessories');
  const upcomingCollections = getCollectionsByCategory('upcoming');
  
  // Get products for dynamic collection images
  const products = await getProductsArray();

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
                      {/* Multiple Images Strip */}
                      <div className="flex h-full">
                        <div className="relative flex-1">
                          <SafeImage
                            src="/images/modern-arab-faded-tee-black-print/faded-bone-main.jpg"
                            alt="Faded Tee"
                            fill
                            sizes="25vw"
                            priority
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="relative flex-1">
                          <SafeImage
                            src="/images/modern-arab-hoodie/faded-bone-main.jpg"
                            alt="Hoodie"
                            fill
                            sizes="25vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="relative flex-1">
                          <SafeImage
                            src="/images/modernarab-crewneck/faded-black-main.jpg"
                            alt="Crewneck"
                            fill
                            sizes="25vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="relative flex-1">
                          <SafeImage
                            src="/images/modern-arab-cap/blue-main.jpg"
                            alt="Cap"
                            fill
                            sizes="25vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-300"></div>
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
          <div className="grid grid-cols-1 gap-8">
            {apparelCollections.map((collection) => (
              <div key={collection.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <Link href={`/collections/${collection.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    {/* Multiple Images Strip - Show actual collection products */}
                    {(() => {
                      const collectionProducts = products.filter(product => {
                        if (collection.slug === 'frontpage') return true;
                        const productType = product.collection.toLowerCase();
                        const collectionSlug = collection.slug.toLowerCase();
                        
                        // Handle collection name mappings
                        if (collectionSlug === 'bottoms') return productType === 'legwear';
                        if (collectionSlug === 'layers') return productType === 'layers';
                        if (collectionSlug === 'headwear') return productType === 'headwear';
                        if (collectionSlug === 'accessories') return productType === 'headwear';
                        
                        return productType === collectionSlug;
                      });
                      
                      // For headwear and bottoms, show multiple color variants
                      const productImages: { src: string; alt: string }[] = [];
                      const collectionSlug = collection.slug.toLowerCase();
                      
                      if (collectionSlug === 'headwear' || collectionSlug === 'accessories') {
                        // For headwear, show different color variants from each product
                        collectionProducts.forEach((product) => {
                          // Add up to 2 color variants per product to fill the 4 slots
                          const colorsToShow = product.colors.slice(0, 2);
                          colorsToShow.forEach((color) => {
                            if (productImages.length < 4 && color.images?.main) {
                              productImages.push({
                                src: color.images.main,
                                alt: `${product.name} - ${color.name}`
                              });
                            }
                          });
                        });
                      } else if (collectionSlug === 'bottoms') {
                        // For bottoms, show multiple color variants to fill all 4 slots
                        collectionProducts.forEach((product) => {
                          product.colors.forEach((color) => {
                            if (productImages.length < 4 && color.images?.main) {
                              productImages.push({
                                src: color.images.main,
                                alt: `${product.name} - ${color.name}`
                              });
                            }
                          });
                        });
                      } else {
                        // For other collections, show one image per product
                        collectionProducts.slice(0, 4).forEach((product) => {
                          if (product.colors[0]?.images?.main) {
                            productImages.push({
                              src: product.colors[0].images.main,
                              alt: product.name || 'Product Image'
                            });
                          }
                        });
                      }
                      
                      if (productImages.length > 0) {
                        return (
                          <div className="flex h-full">
                            {productImages.map((image, idx) => (
                              <div key={idx} className="relative flex-1">
                                <SafeImage
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  sizes="25vw"
                                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            ))}
                            {productImages.length < 4 && [...Array(4 - productImages.length)].map((_, idx) => (
                              <div key={`empty-${idx}`} className="relative flex-1">
                                <SafeImage
                                  src="/images/placeholder.svg"
                                  alt="Coming Soon"
                                  fill
                                  sizes="25vw"
                                  className="object-contain opacity-30"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return (
                          <SafeImage
                            src={collection.image}
                            alt={collection.name}
                            fill
                            sizes="100vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        );
                      }
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/50 group-hover:via-black/30 transition-all duration-300"></div>
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
          <div className="grid grid-cols-1 gap-8">
            {accessoryCollections.map((collection) => (
              <div key={collection.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <Link href={`/collections/${collection.slug}`}>
                  <div className="relative h-64 overflow-hidden">
                    {/* Multiple Images Strip - Show actual collection products */}
                    {(() => {
                      const collectionProducts = products.filter(product => {
                        if (collection.slug === 'frontpage') return true;
                        const productType = product.collection.toLowerCase();
                        const collectionSlug = collection.slug.toLowerCase();
                        
                        // Handle collection name mappings
                        if (collectionSlug === 'bottoms') return productType === 'legwear';
                        if (collectionSlug === 'layers') return productType === 'layers';
                        if (collectionSlug === 'headwear') return productType === 'headwear';
                        if (collectionSlug === 'accessories') return productType === 'headwear';
                        
                        return productType === collectionSlug;
                      });
                      
                      // For headwear and bottoms, show multiple color variants
                      const productImages: { src: string; alt: string }[] = [];
                      const collectionSlug = collection.slug.toLowerCase();
                      
                      if (collectionSlug === 'headwear' || collectionSlug === 'accessories') {
                        // For headwear, show different color variants from each product
                        collectionProducts.forEach((product) => {
                          // Add up to 2 color variants per product to fill the 4 slots
                          const colorsToShow = product.colors.slice(0, 2);
                          colorsToShow.forEach((color) => {
                            if (productImages.length < 4 && color.images?.main) {
                              productImages.push({
                                src: color.images.main,
                                alt: `${product.name} - ${color.name}`
                              });
                            }
                          });
                        });
                      } else if (collectionSlug === 'bottoms') {
                        // For bottoms, show multiple color variants to fill all 4 slots
                        collectionProducts.forEach((product) => {
                          product.colors.forEach((color) => {
                            if (productImages.length < 4 && color.images?.main) {
                              productImages.push({
                                src: color.images.main,
                                alt: `${product.name} - ${color.name}`
                              });
                            }
                          });
                        });
                      } else {
                        // For other collections, show one image per product
                        collectionProducts.slice(0, 4).forEach((product) => {
                          if (product.colors[0]?.images?.main) {
                            productImages.push({
                              src: product.colors[0].images.main,
                              alt: product.name || 'Product Image'
                            });
                          }
                        });
                      }
                      
                      if (productImages.length > 0) {
                        return (
                          <div className="flex h-full">
                            {productImages.map((image, idx) => (
                              <div key={idx} className="relative flex-1">
                                <SafeImage
                                  src={image.src}
                                  alt={image.alt}
                                  fill
                                  sizes="25vw"
                                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            ))}
                            {productImages.length < 4 && [...Array(4 - productImages.length)].map((_, idx) => (
                              <div key={`empty-${idx}`} className="relative flex-1">
                                <SafeImage
                                  src="/images/placeholder.svg"
                                  alt="Coming Soon"
                                  fill
                                  sizes="25vw"
                                  className="object-contain opacity-30"
                                />
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return (
                          <SafeImage
                            src={collection.image}
                            alt={collection.name}
                            fill
                            sizes="100vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                        );
                      }
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/50 group-hover:via-black/30 transition-all duration-300"></div>
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
                      {/* Multiple Images Strip - Show actual collection products */}
                      {(() => {
                        const collectionProducts = products.filter(product => {
                          if (collection.slug === 'frontpage') return true;
                          const productType = product.collection.toLowerCase();
                          return productType === collection.slug.toLowerCase() || 
                                 (collection.slug === 'bottoms' && productType === 'legwear');
                        }).slice(0, 4);
                        
                        if (collectionProducts.length > 0) {
                          return (
                            <div className="flex h-full">
                              {collectionProducts.map((product, idx) => (
                                <div key={idx} className="relative flex-1">
                                  <SafeImage
                                    src={product.colors[0]?.images?.main || '/images/placeholder.jpg'}
                                    alt={product.name}
                                    fill
                                    sizes="25vw"
                                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              ))}
                              {collectionProducts.length < 4 && [...Array(4 - collectionProducts.length)].map((_, idx) => (
                                <div key={`empty-${idx}`} className="relative flex-1 bg-gray-200" />
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <SafeImage
                              src={collection.image}
                              alt={collection.name}
                              fill
                              sizes="100vw"
                              className="object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          );
                        }
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/50 group-hover:via-black/30 group-hover:to-black/10 transition-all duration-300"></div>
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
          
          <div className="relative h-40 rounded-lg overflow-hidden">
            <div className="flex h-full">
              <div className="relative flex-1">
                <SafeImage
                  src="/images/modern-arab-faded-tee-black-print/faded-khaki-main.jpg"
                  alt="Faded Khaki"
                  fill
                  sizes="25vw"
                  priority
                  className="object-contain"
                />
              </div>
              <div className="relative flex-1">
                <SafeImage
                  src="/images/modern-arab-faded-tee-black-print/faded-black-main.jpg"
                  alt="Faded Black"
                  fill
                  sizes="25vw"
                  className="object-contain"
                />
              </div>
              <div className="relative flex-1">
                <SafeImage
                  src="/images/modern-arab-faded-tee-black-print/faded-bone-main.jpg"
                  alt="Faded Bone"
                  fill
                  sizes="25vw"
                  className="object-contain"
                />
              </div>
              <div className="relative flex-1">
                <SafeImage
                  src="/images/modern-arab-faded-tee-black-print/faded-green-main.jpg"
                  alt="Faded Green"
                  fill
                  sizes="25vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/products/modern-arab-faded-tee-black-print" 
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