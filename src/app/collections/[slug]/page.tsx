import { notFound } from 'next/navigation';
import { getCollectionBySlug, collections } from '@/data/collections';
import { products } from '@/app/products/data';
import CollectionPageClient from './CollectionPageClient';

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

  const collectionProducts = products.filter((product) => {
    // For the frontpage collection, show all products
    if (collection.slug === 'frontpage') {
      return true;
    }
    
    // Direct mapping using Shopify product_type
    const productType = product.collection.toLowerCase();
    return productType === collection.slug.toLowerCase() || 
           (collection.slug === 'bottoms' && productType === 'legwear');
  });

  return <CollectionPageClient collection={collection} collectionProducts={collectionProducts} />;
}

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}