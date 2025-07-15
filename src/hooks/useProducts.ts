import { useState, useEffect, useCallback, useRef } from 'react';

// Re-export types from the data file for convenience
export interface ProductVariant {
  size: string;
  price: number;
  sku: string;
  available: boolean;
}

export interface ProductColor {
  name: string;
  swatch: string;
  hex: string;
  images: {
    main: string;
    back: string;
    lifestyle: string[];
  };
  variants: ProductVariant[];
}

export interface Product {
  slug: string;
  name: string;
  vendor: string;
  collection: string;
  tags: string[];
  price: string;
  originalPrice: string;
  description: string;
  fullDescription: string;
  features: string[];
  specifications: string[];
  origin: string[];
  careInstructions: string[];
  sizes?: string[];
  colors: ProductColor[];
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Helper to check if cache is still valid
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_DURATION;
};

// Helper to get from cache
const getFromCache = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
};

// Helper to set cache
const setCache = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

// API error type
interface ApiError {
  error: string;
  status?: number;
}

// Hook return types
interface UseProductsReturn {
  products: Product[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch all products
 * @returns {UseProductsReturn} Object containing products array, loading state, error, and refetch function
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      // Check cache first
      const cachedProducts = getFromCache<Product[]>('products');
      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      const response = await fetch('/api/products', {
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: 'Failed to fetch products' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: Product[] = await response.json();
      
      // Update cache and state
      setCache('products', data);
      setProducts(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
}

/**
 * Custom hook to fetch a single product by slug
 * @param {string} slug - The product slug
 * @returns {UseProductReturn} Object containing product, loading state, error, and refetch function
 */
export function useProduct(slug: string): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setError(new Error('Product slug is required'));
      setLoading(false);
      return;
    }

    try {
      // Check cache first
      const cacheKey = `product-${slug}`;
      const cachedProduct = getFromCache<Product>(cacheKey);
      if (cachedProduct) {
        setProduct(cachedProduct);
        setLoading(false);
        return;
      }

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${slug}`, {
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: 'Product not found' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: Product = await response.json();
      
      // Update cache and state
      setCache(cacheKey, data);
      setProduct(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

/**
 * Helper hook to find a product by slug from already loaded products
 * Useful when you already have all products loaded and want to avoid an extra API call
 * @param {string} slug - The product slug
 * @param {Product[] | null} products - Array of products to search in
 * @returns {Product | null} The found product or null
 */
export function useProductFromList(slug: string, products: Product[] | null): Product | null {
  return products?.find(p => p.slug === slug) || null;
}

/**
 * Clear all cached data
 * Useful for forcing a refresh of product data
 */
export function clearProductCache(): void {
  cache.clear();
}

/**
 * Prefetch products data
 * Useful for preloading data before navigation
 */
export async function prefetchProducts(): Promise<void> {
  try {
    const cachedProducts = getFromCache<Product[]>('products');
    if (cachedProducts) {
      return;
    }

    const response = await fetch('/api/products');
    if (response.ok) {
      const data: Product[] = await response.json();
      setCache('products', data);
    }
  } catch (error) {
    console.error('Failed to prefetch products:', error);
  }
}

/**
 * Prefetch a single product
 * @param {string} slug - The product slug to prefetch
 */
export async function prefetchProduct(slug: string): Promise<void> {
  try {
    const cacheKey = `product-${slug}`;
    const cachedProduct = getFromCache<Product>(cacheKey);
    if (cachedProduct) {
      return;
    }

    const response = await fetch(`/api/products/${slug}`);
    if (response.ok) {
      const data: Product = await response.json();
      setCache(cacheKey, data);
    }
  } catch (error) {
    console.error(`Failed to prefetch product ${slug}:`, error);
  }
}