/**
 * Example usage of the product loader utility
 * This file demonstrates how to use the product loader in your application
 */

import productLoader, {
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
} from './product-loader';

// Example 1: Load a single product
async function loadSingleProductExample() {
  const product = await loadProduct('modern-arab-beanie');
  if (product) {
    console.log('Product loaded:', product.name);
    console.log('Price:', product.price);
    console.log('Available colors:', product.colors.map(c => c.name).join(', '));
  } else {
    console.log('Product not found');
  }
}

// Example 2: Load all products
async function loadAllProductsExample() {
  const products = await loadAllProducts();
  console.log(`Loaded ${products.length} products`);
  
  products.forEach(product => {
    console.log(`- ${product.name} (${product.slug})`);
  });
}

// Example 3: Get available slugs
async function getAvailableSlugsExample() {
  const slugs = await getProductSlugs();
  console.log('Available product slugs:', slugs);
}

// Example 4: Using cache efficiently
async function cacheExample() {
  // First load - will read from disk
  console.time('First load');
  await loadAllProducts();
  console.timeEnd('First load');
  
  // Second load - will use cache
  console.time('Cached load');
  await loadAllProducts();
  console.timeEnd('Cached load');
  
  // Check cache stats
  const stats = getCacheStats();
  console.log('Cache stats:', stats);
  
  // Clear cache if needed
  clearCache();
  console.log('Cache cleared');
}

// Example 5: Preload specific products
async function preloadExample() {
  // Preload specific products for better performance
  await preloadProducts(['modern-arab-beanie', 'modern-arab-bucket-hat']);
  console.log('Products preloaded');
  
  // Now these will be served from cache
  const beanie = await loadProduct('modern-arab-beanie');
  const bucketHat = await loadProduct('modern-arab-bucket-hat');
}

// Example 6: Type-safe product loading
async function typeSafeExample() {
  const product = await getProductBySlug('modern-arab-beanie');
  if (product) {
    // TypeScript knows product is valid here
    console.log(product.colors[0].hex);
  }
}

// Example 7: Filter products by collection
async function filterByCollectionExample() {
  const headwear = await getProductsByCollection('Headwear');
  console.log('Headwear products:', headwear.map(p => p.name));
}

// Example 8: Filter products by tag
async function filterByTagExample() {
  const arabicProducts = await getProductsByTag('Arabic');
  console.log('Arabic-themed products:', arabicProducts.map(p => p.name));
}

// Example 9: Search products
async function searchExample() {
  const results = await searchProducts('beanie');
  console.log('Search results for "beanie":', results.map(p => p.name));
}

// Example 10: Using the singleton directly
async function singletonExample() {
  // You can also use the productLoader singleton directly
  const product = await productLoader.loadProduct('modern-arab-beanie');
  
  // Useful for accessing internal methods
  productLoader.clearCache();
  const stats = productLoader.getCacheStats();
}

// Example 11: Server-side usage in Next.js
export async function getServerSideProps() {
  // Clear cache on each request in development
  if (process.env.NODE_ENV === 'development') {
    clearCache();
  }
  
  const products = await loadAllProducts();
  
  return {
    props: {
      products
    }
  };
}

// Example 12: Static generation in Next.js
export async function getStaticPaths() {
  const slugs = await getProductSlugs();
  
  const paths = slugs.map(slug => ({
    params: { slug }
  }));
  
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const product = await loadProduct(params.slug);
  
  if (!product) {
    return {
      notFound: true
    };
  }
  
  return {
    props: {
      product
    },
    revalidate: 60 // Revalidate every minute
  };
}

// Export examples for testing
export {
  loadSingleProductExample,
  loadAllProductsExample,
  getAvailableSlugsExample,
  cacheExample,
  preloadExample,
  typeSafeExample,
  filterByCollectionExample,
  filterByTagExample,
  searchExample,
  singletonExample
};