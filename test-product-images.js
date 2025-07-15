const { loadAllProducts } = require('./src/lib/product-loader');

async function testProductImages() {
  const products = await loadAllProducts();
  
  console.log('Total products:', products.length);
  console.log('\n=== PRODUCT IMAGE ANALYSIS ===\n');
  
  products.forEach(product => {
    console.log(`\n${product.name} (${product.slug}):`);
    console.log(`Colors: ${product.colors.length}`);
    
    product.colors.forEach(color => {
      console.log(`  ${color.name}:`);
      console.log(`    Main: ${color.images.main}`);
      console.log(`    Back: ${color.images.back}`);
      console.log(`    Lifestyle: ${color.images.lifestyle.join(', ')}`);
      
      // Check if images are local
      const hasLocalImages = 
        color.images.main.startsWith('/images/') ||
        color.images.back.startsWith('/images/') ||
        color.images.lifestyle.some(img => img.startsWith('/images/'));
      
      console.log(`    Has local images: ${hasLocalImages ? '✓' : '✗'}`);
    });
  });
}

testProductImages().catch(console.error);