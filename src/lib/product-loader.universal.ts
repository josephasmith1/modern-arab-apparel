/**
 * Universal product loader that works in both server and client environments
 * Automatically detects the environment and uses the appropriate implementation
 */

import { Product } from '@/data/products';

// Define the loader interface
interface IProductLoader {
  loadProduct(slug: string): Promise<Product | null>;
  loadAllProducts(): Promise<Product[]>;
  getProductSlugs(): Promise<string[]>;
  clearCache(): void;
  preloadProducts(slugs: string[]): Promise<void>;
  getCacheStats(): { productCount: number; cacheAge: number; isValid: boolean };
}

// Lazy load the appropriate implementation based on environment
let loaderInstance: IProductLoader | null = null;

async function getLoader(): Promise<IProductLoader> {
  if (loaderInstance) {
    return loaderInstance;
  }

  if (typeof window === 'undefined') {
    // Server environment - use file system loader
    const { default: serverLoader } = await import('./product-loader');
    loaderInstance = serverLoader;
  } else {
    // Client environment - use API loader
    const { default: clientLoader } = await import('./product-loader.client');
    loaderInstance = clientLoader;
  }

  return loaderInstance;
}

// Export universal functions
export async function loadProduct(slug: string): Promise<Product | null> {
  const loader = await getLoader();
  return loader.loadProduct(slug);
}

export async function loadAllProducts(): Promise<Product[]> {
  const loader = await getLoader();
  return loader.loadAllProducts();
}

export async function getProductSlugs(): Promise<string[]> {
  const loader = await getLoader();
  return loader.getProductSlugs();
}

export async function clearCache(): Promise<void> {
  const loader = await getLoader();
  return loader.clearCache();
}

export async function preloadProducts(slugs: string[]): Promise<void> {
  const loader = await getLoader();
  return loader.preloadProducts(slugs);
}

export async function getCacheStats(): Promise<{ 
  productCount: number; 
  cacheAge: number; 
  isValid: boolean 
}> {
  const loader = await getLoader();
  return loader.getCacheStats();
}

// Re-export helper functions that work universally
export { isValidProduct } from './product-loader';

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await loadProduct(slug);
  return product;
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  return allProducts.filter(product => product.collection === collection);
}

export async function getProductsByTag(tag: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  return allProducts.filter(product => product.tags.includes(tag));
}

export async function searchProducts(query: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  const lowerQuery = query.toLowerCase();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// Default export for convenience
const universalLoader = {
  loadProduct,
  loadAllProducts,
  getProductSlugs,
  clearCache,
  preloadProducts,
  getCacheStats,
  getProductBySlug,
  getProductsByCollection,
  getProductsByTag,
  searchProducts
};

export default universalLoader;