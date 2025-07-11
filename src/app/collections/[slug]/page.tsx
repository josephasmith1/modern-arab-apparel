import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { getCollectionBySlug } from '@/data/collections';

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
          
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-black font-bodoni">
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
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl md:text-5xl font-black mb-4 font-bodoni">
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
            <h3 className="text-2xl font-black mb-6 text-black font-bodoni">
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
            <h3 className="text-2xl font-black mb-6 text-black font-bodoni">
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

        {/* Coming Soon Notice */}
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-black mb-6 text-black font-bodoni">
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
                className="bg-white text-black border-2 border-black px-8 py-4 rounded-lg font-semibold hover:bg-black hover:text-white transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </div>

        {/* Related Collections */}
        <div className="mt-20">
          <h3 className="text-3xl font-black mb-8 text-black font-bodoni text-center">
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