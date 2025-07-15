/**
 * Synchronous product data access functions
 * These functions are for client-side usage and backward compatibility
 */

import { Product } from './types';
import { products as staticProducts } from './products-data';

// Re-export types for convenience
export type { Product, ProductColor, ProductVariant } from './types';

// Use static products data
export const products: Product[] = staticProducts;

/**
 * Find a product by slug
 */
export function findProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

/**
 * Get products by collection
 */
export function getProductsByCollection(collection: string): Product[] {
  return products.filter(p => p.collection === collection);
}

/**
 * Get products by tag
 */
export function getProductsByTag(tag: string): Product[] {
  return products.filter(p => p.tags.includes(tag));
}

/**
 * Get unique collections
 */
export function getCollections(): string[] {
  const collections = new Set(products.map(p => p.collection));
  return Array.from(collections).sort();
}

/**
 * Get unique tags
 */
export function getTags(): string[] {
  const tags = new Set(products.flatMap(p => p.tags));
  return Array.from(tags).sort();
}