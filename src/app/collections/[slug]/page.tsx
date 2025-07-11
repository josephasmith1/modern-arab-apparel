import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { getCollectionBySlug } from '@/data/collections';
import comprehensiveProducts from '../../../../data/comprehensive-products.json';
import productsJson from '../../../../data/products.json';

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

  // Function to get products for this collection
  function getCollectionProducts() {
    // Use comprehensive products data
    const allProducts = comprehensiveProducts.map(product => ({
      slug: product.slug || '',
      name: product.name || '',
      price: product.price || '$0.00',
      image: product.colors?.[0]?.images?.main || '/images/modern-arab-faded-tee/faded-khaki-1.jpg',
      colors: product.colors || undefined,
      description: product.description || '',
    }));

    // Filter products based on collection
    const collectionProducts = allProducts.filter(product => {
      const lowerName = product.name?.toLowerCase() || '';
      const lowerCollectionName = collection.name.toLowerCase();
      const collectionSlug = collection.slug.toLowerCase();
      const productCategory = product.category?.toLowerCase() || '';
      
      // Match based on collection type using category
      if (lowerCollectionName.includes('top') && (productCategory.includes('shirt') || productCategory.includes('t-shirt'))) return true;
      if (lowerCollectionName.includes('layer') && (productCategory.includes('hoodie') || productCategory.includes('sweatshirt') || productCategory.includes('crewneck'))) return true;
      if (lowerCollectionName.includes('headwear') && productCategory.includes('accessories')) return true;
      if (lowerCollectionName.includes('bottom') && productCategory.includes('bottom')) return true;
      
      // Specific slug matching for known collections
      if (collectionSlug === 'do-not-fear-god-tee' && productCategory.includes('shirt')) return true;
      if (collectionSlug === 'dont-fear-the-name-allah-premium-oversized-crewneck' && (productCategory.includes('hoodie') || productCategory.includes('sweatshirt'))) return true;
      if (collectionSlug === 'modern-arab-cap' && productCategory.includes('accessories')) return true;
      if (collectionSlug === 'legwear' && productCategory.includes('bottom')) return true;
      
      // Fallback: if it's frontpage/featured, show all
      if (collection.slug === 'frontpage' || collection.category === 'featured') return true;
      
      return false;
    });

    // If only 1 product with multiple colors, expand each color as separate item
    if (collectionProducts.length === 1 && 'colors' in collectionProducts[0] && collectionProducts[0].colors && collectionProducts[0].colors.length > 1) {
      const product = collectionProducts[0];
      return product.colors.map(color => ({
        ...product,
        id: `${product.slug}-${color.name}`,
        displayName: `${product.name} - ${color.name}`,
        selectedColor: color,
        image: color.images.main,
        colors: [color] // Show only this color
      }));
    }

    return collectionProducts;
  }

  const collectionProducts = getCollectionProducts();

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
              className="object-cover object-center"
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
            {collectionProducts.map((product, index) => (
              <div key={product.id || `${product.slug}-${index}`} className="bg-white rounded-lg shadow-xl overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={product.image || (product.selectedColor?.images.main) || (('colors' in product && product.colors) ? product.colors[0].images.main : '/images/modern-arab-faded-tee-faded-khaki-1.jpg')}
                      alt={product.displayName || product.name || 'Product image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition-colors font-bodoni">
                      {product.displayName ? (
                        <>
                          {product.name}
                          {product.selectedColor && (
                            <span className="block text-lg text-gray-600 font-barlow-condensed font-normal">
                              in {product.selectedColor.name}
                            </span>
                          )}
                        </>
                      ) : (
                        product.name
                      )}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 font-barlow-condensed">
                      {product.description || "A statement piece that combines cultural heritage with modern streetwear."}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-black">{product.price}</span>
                        {('originalPrice' in product && product.originalPrice && product.originalPrice !== product.price) && (
                          <span className="text-lg text-gray-500 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      {product.selectedColor && (
                        <div className="flex space-x-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: product.selectedColor.hex }}
                            title={product.selectedColor.name}
                          />
                        </div>
                      )}
                    </div>
                    
                    {('specifications' in product && product.specifications) && (
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
  return [
    { slug: 'frontpage' },
    { slug: 'do-not-fear-god-tee' },
    { slug: 'dont-fear-the-name-allah-premium-oversized-crewneck' },
    { slug: 'modern-arab-cap' },
    { slug: 'coming-soon' },
    { slug: 'legwear' },
  ];
}