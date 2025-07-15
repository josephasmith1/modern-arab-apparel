const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '../src/data/products');

// Read all JSON files in the products directory
const files = fs.readdirSync(productsDir).filter(file => file.endsWith('.json'));

const results = [];

files.forEach(file => {
  const filePath = path.join(productsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const product = data.product;
  
  // Check if product has any Shopify URLs
  const hasShopifyUrls = {
    productName: product.title,
    handle: product.handle,
    fileName: file,
    mainImage: product.image?.src?.includes('cdn.shopify.com') ? product.image.src : null,
    variants: [],
    additionalImages: []
  };
  
  // Check variants
  if (product.variants) {
    product.variants.forEach(variant => {
      // Find the image for this variant
      const variantImage = product.images?.find(img => 
        img.variant_ids?.includes(variant.id)
      );
      
      if (variantImage?.src?.includes('cdn.shopify.com')) {
        hasShopifyUrls.variants.push({
          variantTitle: variant.title,
          variantId: variant.id,
          imageUrl: variantImage.src
        });
      }
    });
  }
  
  // Check all images
  if (product.images) {
    product.images.forEach(image => {
      if (image.src?.includes('cdn.shopify.com')) {
        hasShopifyUrls.additionalImages.push({
          imageId: image.id,
          position: image.position,
          url: image.src,
          associatedVariants: image.variant_ids || []
        });
      }
    });
  }
  
  // Only add to results if there are Shopify URLs
  if (hasShopifyUrls.mainImage || hasShopifyUrls.variants.length > 0 || hasShopifyUrls.additionalImages.length > 0) {
    results.push(hasShopifyUrls);
  }
});

// Print results
console.log('=== Products with Shopify CDN URLs ===\n');

results.forEach(result => {
  console.log(`Product: ${result.productName}`);
  console.log(`Handle: ${result.handle}`);
  console.log(`File: ${result.fileName}`);
  
  if (result.mainImage) {
    console.log(`Main Image: ${result.mainImage}`);
  }
  
  if (result.variants.length > 0) {
    console.log('\nVariants with Shopify URLs:');
    result.variants.forEach(variant => {
      console.log(`  - ${variant.variantTitle} (ID: ${variant.variantId})`);
      console.log(`    URL: ${variant.imageUrl}`);
    });
  }
  
  console.log(`\nTotal Images with Shopify URLs: ${result.additionalImages.length}`);
  console.log('---\n');
});

// Summary
console.log('=== SUMMARY ===');
console.log(`Total products analyzed: ${files.length}`);
console.log(`Products with Shopify URLs: ${results.length}`);

// Count variants
const totalVariantsWithShopify = results.reduce((sum, product) => 
  sum + product.variants.length, 0
);
console.log(`Total variants with Shopify URLs: ${totalVariantsWithShopify}`);

// Save detailed report
const report = {
  summary: {
    totalProducts: files.length,
    productsWithShopifyUrls: results.length,
    totalVariantsWithShopifyUrls: totalVariantsWithShopify
  },
  products: results
};

fs.writeFileSync(
  path.join(__dirname, 'shopify-urls-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\nDetailed report saved to shopify-urls-report.json');