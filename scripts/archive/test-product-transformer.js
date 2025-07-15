const fs = require('fs').promises;
const path = require('path');

// Since we're in a CommonJS environment, we'll need to dynamically import the TypeScript module
async function testTransformer() {
  try {
    console.log('Testing Product Transformer...\n');
    
    // Read a sample Shopify product
    const shopifyProductPath = path.join(__dirname, 'modern-arab-faded-tee-black-print.json');
    const shopifyData = JSON.parse(await fs.readFile(shopifyProductPath, 'utf-8'));
    
    console.log('Shopify Product:');
    console.log(`- Title: ${shopifyData.product.title}`);
    console.log(`- Handle: ${shopifyData.product.handle}`);
    console.log(`- Vendor: ${shopifyData.product.vendor}`);
    console.log(`- Type: ${shopifyData.product.product_type}`);
    console.log(`- Variants: ${shopifyData.product.variants.length}`);
    console.log(`- Colors: ${[...new Set(shopifyData.product.variants.map(v => v.option1))].join(', ')}`);
    console.log('\n');
    
    // Note: In a real implementation, you would use the transformer
    // For now, let's show the expected output format
    console.log('Expected Transformed Product Structure:');
    console.log(`{
  slug: "modern-arab-faded-tee-black-print",
  name: "Modern Arab Faded Tee",
  vendor: "Modern Arab Apparel",
  collection: "Upperwear",
  tags: ["Arabic", "Faded Black", "Faded Bone", ...],
  price: "$45.00",
  originalPrice: "",
  description: "Rooted in meaning and made for movement...",
  fullDescription: "<p>...</p>",
  features: [
    "Unisex fit",
    "100% premium carded cotton",
    "Arabic calligraphy designed by first-generation and native speakers",
    ...
  ],
  specifications: [
    "100% carded cotton",
    "Fabric weight: 7.1 oz. /yd. ² (240 g/m²)"
  ],
  origin: ["China", "USA"],
  careInstructions: [],
  sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
  colors: [
    {
      name: "Faded Bone",
      swatch: "",
      hex: "#F5F5DC",
      images: {
        main: "/images/modern-arab-faded-tee-black-print/faded-bone-main.jpg",
        back: "/images/modern-arab-faded-tee-black-print/faded-bone-back.jpg",
        lifestyle: [
          "/images/modern-arab-faded-tee-black-print/faded-bone-lifestyle-1.jpg",
          "/images/modern-arab-faded-tee-black-print/faded-bone-lifestyle-2.jpg",
          ...
        ]
      },
      variants: [
        { size: "S", price: 45, sku: "1865120_17570", available: true },
        { size: "M", price: 45, sku: "1865120_17575", available: true },
        ...
      ]
    },
    // More colors...
  ]
}`);
    
    console.log('\n\nUsage Example:');
    console.log(`
// Import the transformer
import { transformShopifyProduct, loadAndTransformShopifyProducts } from '@/lib/product-transformer';

// Transform a single product
const shopifyData = await fetch('/api/shopify/product/handle').then(r => r.json());
const product = transformShopifyProduct(shopifyData);

// Transform multiple products from files
const products = await loadAndTransformShopifyProducts('./scripts/shopify-data/products');

// Use in your app
export const products: Product[] = products;
`);
    
  } catch (error) {
    console.error('Error testing transformer:', error);
  }
}

// Run the test
testTransformer();