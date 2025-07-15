const fs = require('fs').promises;
const path = require('path');

/**
 * Transform all Shopify products to the app's Product format
 * This is a Node.js script that demonstrates how to use the transformer
 */
async function transformAllProducts() {
  try {
    console.log('Transforming all Shopify products...\n');
    
    // Read all JSON files from the current directory
    const files = await fs.readdir(__dirname);
    const productFiles = files.filter(file => 
      file.endsWith('.json') && 
      !file.includes('shopify-collections') && 
      !file.includes('image-mappings') &&
      !file.includes('handle-mapping') &&
      !file.includes('rebuild-summary') &&
      !file.includes('all-products') &&
      !file.includes('consolidated-products')
    );
    
    console.log(`Found ${productFiles.length} product files to transform:\n`);
    
    const transformedProducts = [];
    
    for (const file of productFiles) {
      const filePath = path.join(__dirname, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const shopifyData = JSON.parse(content);
      
      // Extract product (handle both wrapper and direct formats)
      const product = shopifyData.product || shopifyData;
      
      console.log(`Processing: ${product.title || 'Unknown'} (${file})`);
      
      // Manual transformation (simplified version)
      const transformed = {
        slug: product.handle || file.replace('.json', ''),
        name: product.title || 'Untitled Product',
        vendor: product.vendor || 'Unknown Vendor',
        collection: product.product_type || 'General',
        tags: product.tags ? product.tags.split(',').map(t => t.trim()) : [],
        // ... rest of transformation would happen here
      };
      
      transformedProducts.push(transformed);
    }
    
    // Save the transformed products
    const outputPath = path.join(__dirname, 'transformed-products.json');
    await fs.writeFile(
      outputPath, 
      JSON.stringify(transformedProducts, null, 2),
      'utf-8'
    );
    
    console.log(`\nTransformed ${transformedProducts.length} products`);
    console.log(`Output saved to: ${outputPath}`);
    
    // Show example of how to use with the TypeScript transformer
    console.log('\n--- TypeScript Usage Example ---\n');
    console.log(`
// In a TypeScript file:
import { loadAndTransformShopifyProducts } from '@/lib/product-transformer';

async function generateProductData() {
  const products = await loadAndTransformShopifyProducts('./scripts');
  
  // Write to data.ts
  const dataContent = \`
// Auto-generated product data
import { Product } from './types';

export const products: Product[] = \${JSON.stringify(products, null, 2)};
\`;
  
  await fs.writeFile('./src/app/products/data.ts', dataContent);
}
`);
    
  } catch (error) {
    console.error('Error transforming products:', error);
  }
}

// Run the transformation
transformAllProducts();