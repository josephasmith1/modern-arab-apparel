/**
 * Example of how to migrate from the old data.ts to the new products index
 */

// OLD WAY - importing from data.ts
// import { products } from '@/app/products/data';

// NEW WAY - importing from products sync (loads from JSON files synchronously)
import { products, findProductBySlug, getProductsByCollection } from '@/data/products/sync';

// The interface is exactly the same, so no code changes needed!

export function ExampleProductList() {
  return (
    <div>
      <h2>All Products</h2>
      {products.map(product => (
        <div key={product.slug}>
          <h3>{product.name}</h3>
          <p>{product.price}</p>
        </div>
      ))}
    </div>
  );
}

export function ExampleProductDetail({ slug }: { slug: string }) {
  const product = findProductBySlug(slug);
  
  if (!product) {
    return <div>Product not found</div>;
  }
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
}

export function ExampleCollectionPage({ collection }: { collection: string }) {
  const products = getProductsByCollection(collection);
  
  return (
    <div>
      <h2>{collection} Collection</h2>
      <p>{products.length} products</p>
      {products.map(product => (
        <div key={product.slug}>{product.name}</div>
      ))}
    </div>
  );
}