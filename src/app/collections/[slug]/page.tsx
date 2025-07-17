import { notFound } from 'next/navigation';
import { getCollectionBySlug, collections } from '@/data/collections';
import { getProductsArray } from '@/data/products';
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

  // Load products directly from JSON files
  const products = await getProductsArray();

  const collectionProducts = products.filter((product) => {
    // For the frontpage collection, show all products
    if (collection.slug === 'frontpage') {
      return true;
    }
    
    // Direct mapping using Shopify product_type with proper case handling
    const productType = product.collection.toLowerCase();
    const slug = collection.slug.toLowerCase();
    
    // Map collection slugs to product types
    const collectionMap: { [key: string]: string[] } = {
      'upperwear': ['upperwear'],
      'layers': ['layers'],
      'headwear': ['headwear'],
      'bottoms': ['legwear', 'bottoms'], // Include both legwear and bottoms
    };
    
    const validTypes = collectionMap[slug] || [slug];
    return validTypes.includes(productType);
  });

  return <CollectionPageClient collection={collection} collectionProducts={collectionProducts} />;
}

export async function generateStaticParams() {
  return collections.map((collection) => ({
    slug: collection.slug,
  }));
}