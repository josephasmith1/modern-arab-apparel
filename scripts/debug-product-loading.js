const { loadAllProducts } = require('../src/lib/product-loader.ts');

async function debugProductLoading() {
  console.log('Loading products from JSON files...');
  
  try {
    const products = await loadAllProducts();
    
    console.log(`\nTotal products loaded: ${products.length}\n`);
    
    // Check specific products known to have multiple colors
    const multiColorProducts = [
      'modern-arab-hoodie',
      'modern-arab-cap',
      'modern-arab-bucket-hat',
      'modern-arab-joggers'
    ];
    
    for (const slug of multiColorProducts) {
      const product = products.find(p => p.slug === slug);
      if (product) {
        console.log(`\n${product.name} (${slug}):`);
        console.log(`  Collection: ${product.collection}`);
        console.log(`  Number of colors: ${product.colors.length}`);
        
        product.colors.forEach((color, idx) => {
          console.log(`  Color ${idx + 1}: ${color.name}`);
          console.log(`    - Hex: ${color.hex}`);
          console.log(`    - Main image: ${color.images.main}`);
          console.log(`    - Variants: ${color.variants.length} sizes`);
          console.log(`    - Sizes: ${color.variants.map(v => v.size).join(', ')}`);
        });
      } else {
        console.log(`\nProduct ${slug} not found!`);
      }
    }
    
    // Check single-color products
    console.log('\n\nChecking single-color products:');
    const singleColorProducts = [
      'modernarab-tee-black',
      'modernarab-tee-white'
    ];
    
    for (const slug of singleColorProducts) {
      const product = products.find(p => p.slug === slug);
      if (product) {
        console.log(`\n${product.name} (${slug}):`);
        console.log(`  Number of colors: ${product.colors.length}`);
        console.log(`  Color: ${product.colors[0]?.name}`);
        console.log(`  Main image: ${product.colors[0]?.images.main}`);
      }
    }
    
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

debugProductLoading();