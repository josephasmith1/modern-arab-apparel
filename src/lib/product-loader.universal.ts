/**
 * Universal product loader that works in both server and client environments
 * Automatically detects the environment and uses the appropriate implementation
 */

import { Product } from '@/data/products';

// Export universal functions that delegate to the appropriate loader
export async function loadProduct(slug: string): Promise<Product | null> {
  if (typeof window === 'undefined') {
    // Server environment
    const { loadProductBySlug } = await import('./product-loader');
    return loadProductBySlug(slug);
  } else {
    // Client environment
    const { loadProduct } = await import('./product-loader.client');
    return loadProduct(slug);
  }
}

export async function loadAllProducts(): Promise<Product[]> {
  if (typeof window === 'undefined') {
    // Server environment
    const { loadAllProducts } = await import('./product-loader');
    return loadAllProducts();
  } else {
    // Client environment
    const { loadAllProducts } = await import('./product-loader.client');
    return loadAllProducts();
  }
}

export async function getProductSlugs(): Promise<string[]> {
  if (typeof window === 'undefined') {
    // Server environment
    const { getProductSlugs } = await import('./product-loader');
    return getProductSlugs();
  } else {
    // Client environment
    const { getProductSlugs } = await import('./product-loader.client');
    return getProductSlugs();
  }
}

// Helper functions
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return loadProduct(slug);
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

