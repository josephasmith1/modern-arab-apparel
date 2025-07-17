'use server';

/**
 * Products index file for server-side product data access
 * This module loads products from JSON files and provides a unified interface
 * for server components to access product data
 */

import { Product } from './types';
import { products } from './products-data';

// Re-export types for convenience
export type { Product, ProductColor, ProductVariant } from './types';

/**
 * Get all products from static generated data
 * This function now uses the pre-generated products-data.ts file
 */
async function getProducts(): Promise<Product[]> {
  if (products.length === 0) {
    console.warn('No products found in products-data.ts. Run generate-products-data.js to regenerate.');
  } else {
    console.log(`Successfully loaded ${products.length} products from static data`);
  }
  
  return products;
}

/**
 * Export products array as an async function for server components
 * Use this in server components: const products = await getProductsArray();
 */
export async function getProductsArray(): Promise<Product[]> {
  return getProducts();
}

/**
 * Find a product by slug (async version for server components)
 */
export async function findProductBySlug(slug: string): Promise<Product | undefined> {
  const allProducts = await getProducts();
  return allProducts.find(p => p.slug === slug);
}

/**
 * Get products by collection (async version for server components)
 */
export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(p => p.collection === collection);
}

/**
 * Get products by tag (async version for server components)
 */
export async function getProductsByTag(tag: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(p => p.tags.includes(tag));
}

/**
 * Get unique collections (async version for server components)
 */
export async function getCollections(): Promise<string[]> {
  const allProducts = await getProducts();
  const collections = new Set(allProducts.map(p => p.collection));
  return Array.from(collections).sort();
}

/**
 * Get unique tags (async version for server components)
 */
export async function getTags(): Promise<string[]> {
  const allProducts = await getProducts();
  const tags = new Set(allProducts.flatMap(p => p.tags));
  return Array.from(tags).sort();
}

/**
 * Refresh products cache (useful for development)
 * Returns the refreshed products array
 */
export async function refreshProducts(): Promise<Product[]> {
  productsCache = null;
  return getProducts();
}