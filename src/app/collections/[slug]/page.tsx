import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { getCollectionBySlug, collections } from '@/data/collections';
import { products } from '@/app/products/data';

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  
  if (!collection) {
    notFound();
  }

  const collectionProducts = products.filter(
    (product) => product.collection.toLowerCase() === collection.slug.toLowerCase()
  );

  return (
    <div className="min-h-screen text-black" style={{ backgroundColor: '#f0edec' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Collection Header */}
        <div className="text-center mb-16">
          <nav className="mb-8">
            <ol className="flex items-center justify-center space-x-2 text-sm font-barlow-condensed">
              <li>
                <Link href="/" className="text-gray-500 hover:text-black transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/collections" className="text-gray-500 hover:text-black transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-black font-medium">
                {collection.name}
              </li>
            </ol>
          </nav>
          
          <h1 className="text-5xl md:text-6xl font-light mb-6 text-black font-bodoni">
            {collection.name}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-barlow-condensed">
            {collection.description}
          </p>
        </div>

        {/* Collection Hero Image */}
        <div className="mb-16">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              sizes="100vw"
              priority
              className="object-contain object-center"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl md:text-5xl font-light mb-4 font-bodoni">
                  {collection.name}
                </h2>
                <p className="text-lg md:text-xl font-barlow-condensed max-w-2xl mx-auto">
                  {collection.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-light mb-6 text-black font-bodoni">
              Collection Details
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-500 font-barlow-condensed">Category</span>
                <p className="text-lg font-medium text-black capitalize">{collection.category}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 font-barlow-condensed">Last Updated</span>
                <p className="text-lg font-medium text-black">{new Date(collection.lastmod).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 font-barlow-condensed">Update Frequency</span>
                <p className="text-lg font-medium text-black capitalize">{collection.changefreq}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="text-2xl font-light mb-6 text-black font-bodoni">
              About This Collection
            </h3>
            <p className="text-gray-700 mb-6 font-barlow-condensed leading-relaxed">
              {collection.description}
            </p>
            <p className="text-gray-600 text-sm font-barlow-condensed">
              This collection represents our commitment to authentic cultural expression and premium quality. 
              Each piece is carefully curated to bring you the finest in Modern Arab Apparel.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {collectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {collectionProducts.map((product) => (
              <div key={product.slug} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-96 overflow-hidden">
                    <Image
                      src={product.colors[0].images.main || '/images/placeholder.jpg'}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
                      {product.name}
                    </h3>
                    <div className="flex items-center mt-2 mb-2">
                      <div className="flex space-x-2">
                        {product.colors.slice(0, 5).map((color) => (
                          <span
                            key={color.name}
                            className="block w-5 h-5 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 5}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 font-barlow-condensed">
                      {product.description || "Premium apparel featuring Modern Arab branding and quality construction."}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-black font-barlow-condensed">{product.price}</span>
                        {(product.originalPrice && product.originalPrice !== product.price) && (
                          <span className="text-lg text-gray-500 line-through font-barlow-condensed">{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-xl p-8 text-center mb-16">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-3xl font-light mb-6 text-black font-bodoni">
                Products Coming Soon
              </h3>
              <p className="text-xl text-gray-700 mb-8 font-barlow-condensed">
                We&apos;re currently updating our product catalog for this collection. 
                Check back soon to see all the amazing products we have in store!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/collections"
                  className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Browse All Collections
                </Link>
                <Link 
                  href="/products"
                  className="bg-white text-black border-2 border-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Related Collections */}
        <div className="mt-20">
          <h3 className="text-3xl font-light mb-8 text-black font-bodoni text-center">
            Explore More Collections
          </h3>
          <div className="text-center">
            <Link 
              href="/collections"
              className="inline-flex items-center text-black hover:text-gray-700 transition-colors font-barlow-condensed"
            >
              <span className="text-lg font-medium mr-2">View All Collections</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}