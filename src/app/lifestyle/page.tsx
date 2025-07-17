
import { getProductsArray } from '@/data/products';
import LifestylePageClient from './LifestylePageClient';
import { Product } from '@/data/products/types';

// The main page component is now a server component
export default async function LifestylePage() {
  // Load products directly from JSON files
  const products: Product[] = await getProductsArray();

  // Filter for products that have at least one lifestyle image across all color variants
  const lifestyleProducts = products.filter(product => 
    product.colors.some(color => color.images.lifestyle && color.images.lifestyle.length > 0)
  );

  return <LifestylePageClient allProducts={lifestyleProducts} />;
}
