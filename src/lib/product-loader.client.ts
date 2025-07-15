/**
 * Client-side product loader for browser environments
 * This version fetches products via API endpoints instead of reading files directly
 */

import { Product } from '@/data/products';

// Cache interface
interface ProductCache {
  products: Map<string, Product>;
  allProducts: Product[] | null;
  lastUpdate: number;
}

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

// API base path
const API_BASE = '/api/products';

class ClientProductLoader {
  private cache: ProductCache = {
    products: new Map(),
    allProducts: null,
    lastUpdate: 0
  };

  /**
   * Check if cache is still valid
   */
  private isCacheValid(): boolean {
    return Date.now() - this.cache.lastUpdate < CACHE_TTL;
  }

  /**
   * Load a single product by slug
   */
  async loadProduct(slug: string): Promise<Product | null> {
    try {
      // Check cache first
      if (this.cache.products.has(slug) && this.isCacheValid()) {
        return this.cache.products.get(slug)!;
      }

      // Fetch from API
      const response = await fetch(`${API_BASE}/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch product: ${response.statusText}`);
      }

      const product: Product = await response.json();

      // Update cache
      this.cache.products.set(slug, product);
      this.cache.lastUpdate = Date.now();

      return product;
    } catch (error) {
      console.error(`Error loading product ${slug}:`, error);
      return null;
    }
  }

  /**
   * Load all products
   */
  async loadAllProducts(): Promise<Product[]> {
    try {
      // Check cache first
      if (this.cache.allProducts && this.isCacheValid()) {
        return this.cache.allProducts;
      }

      // Fetch from API
      const response = await fetch(API_BASE);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const products: Product[] = await response.json();

      // Update individual product cache
      products.forEach(product => {
        this.cache.products.set(product.slug, product);
      });

      // Update cache
      this.cache.allProducts = products;
      this.cache.lastUpdate = Date.now();

      return products;
    } catch (error) {
      console.error('Error loading all products:', error);
      return [];
    }
  }

  /**
   * Get list of available product slugs
   */
  async getProductSlugs(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE}/slugs`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch slugs: ${response.statusText}`);
      }

      const slugs: string[] = await response.json();
      return slugs;
    } catch (error) {
      console.error('Error getting product slugs:', error);
      return [];
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache = {
      products: new Map(),
      allProducts: null,
      lastUpdate: 0
    };
  }

  /**
   * Preload specific products into cache
   */
  async preloadProducts(slugs: string[]): Promise<void> {
    await Promise.all(slugs.map(slug => this.loadProduct(slug)));
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { 
    productCount: number; 
    cacheAge: number; 
    isValid: boolean 
  } {
    return {
      productCount: this.cache.products.size,
      cacheAge: Date.now() - this.cache.lastUpdate,
      isValid: this.isCacheValid()
    };
  }

  /**
   * Enable automatic cache refresh
   */
  enableAutoRefresh(interval: number = CACHE_TTL): () => void {
    const intervalId = setInterval(() => {
      if (!this.isCacheValid()) {
        this.clearCache();
      }
    }, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}

// Create singleton instance
const clientProductLoader = new ClientProductLoader();

// Export singleton instance and methods
export default clientProductLoader;

// Export convenience functions for direct usage
export const loadProduct = (slug: string) => clientProductLoader.loadProduct(slug);
export const loadAllProducts = () => clientProductLoader.loadAllProducts();
export const getProductSlugs = () => clientProductLoader.getProductSlugs();
export const clearCache = () => clientProductLoader.clearCache();
export const preloadProducts = (slugs: string[]) => clientProductLoader.preloadProducts(slugs);
export const getCacheStats = () => clientProductLoader.getCacheStats();
export const enableAutoRefresh = (interval?: number) => clientProductLoader.enableAutoRefresh(interval);

// Type guard to check if a value is a valid Product
export function isValidProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') return false;
  
  const product = value as Partial<Product>;
  
  return !!(
    product.slug &&
    product.name &&
    product.vendor &&
    product.collection &&
    Array.isArray(product.tags) &&
    product.price &&
    product.description &&
    Array.isArray(product.colors) &&
    product.colors.length > 0
  );
}

// Helper to get product by slug with type safety
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = await loadProduct(slug);
  return product && isValidProduct(product) ? product : null;
}

// Helper to get products by collection
export async function getProductsByCollection(collection: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  return allProducts.filter(product => product.collection === collection);
}

// Helper to get products by tag
export async function getProductsByTag(tag: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  return allProducts.filter(product => product.tags.includes(tag));
}

// Helper to search products by name or description
export async function searchProducts(query: string): Promise<Product[]> {
  const allProducts = await loadAllProducts();
  const lowerQuery = query.toLowerCase();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// React hook for loading products
export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadProduct(slug);
        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load product'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading, error };
}

// React hook for loading all products
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const data = await loadAllProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load products'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error };
}

// Import React dependencies only if available
let useState: any, useEffect: any;
if (typeof window !== 'undefined' && 'React' in window) {
  const React = (window as any).React;
  useState = React.useState;
  useEffect = React.useEffect;
}