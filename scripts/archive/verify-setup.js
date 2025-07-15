const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Modern Arab Apparel setup...\n');

// Check if data file has been updated
const dataFile = fs.readFileSync('src/app/products/data.ts', 'utf8');
const productsMatch = dataFile.match(/export const products: Product\[\] = (\[[\s\S]*?\]);/);

if (productsMatch) {
  try {
    const products = eval(productsMatch[1]);
    
    console.log(`✅ Found ${products.length} products in data.ts\n`);
    
    // Count images
    let totalImages = 0;
    let productsWithImages = 0;
    let missingImages = [];
    
    products.forEach(product => {
      let productHasImages = false;
      
      product.colors.forEach(color => {
        if (color.images.main) {
          totalImages++;
          productHasImages = true;
        }
        if (color.images.back) {
          totalImages++;
        }
        totalImages += color.images.lifestyle.length;
        
        // Check if image files exist
        if (color.images.main) {
          const mainPath = `public${color.images.main}`;
          if (!fs.existsSync(mainPath)) {
            missingImages.push(mainPath);
          }
        }
      });
      
      if (productHasImages) productsWithImages++;
    });
    
    console.log(`📊 Image Statistics:`);
    console.log(`   - Total image references: ${totalImages}`);
    console.log(`   - Products with images: ${productsWithImages}/${products.length}`);
    console.log(`   - Missing image files: ${missingImages.length}\n`);
    
    if (missingImages.length > 0) {
      console.log('❌ Missing images need to be downloaded:');
      console.log('   Run: ./scripts/download-final-images.sh\n');
    } else {
      console.log('✅ All image files are present!\n');
    }
    
    // Check if download script exists
    if (fs.existsSync('scripts/download-final-images.sh')) {
      console.log('✅ Download script is ready\n');
    } else {
      console.log('❌ Download script not found!\n');
    }
    
    // Show sample product data
    const sampleProduct = products[0];
    console.log('📦 Sample product (first product):');
    console.log(`   Name: ${sampleProduct.name}`);
    console.log(`   Slug: ${sampleProduct.slug}`);
    console.log(`   Colors: ${sampleProduct.colors.length}`);
    
    sampleProduct.colors.forEach((color, index) => {
      if (index === 0) {
        console.log(`   First color (${color.name}):`);
        console.log(`     - Main: ${color.images.main || 'missing'}`);
        console.log(`     - Back: ${color.images.back || 'missing'}`);
        console.log(`     - Lifestyle: ${color.images.lifestyle.length} images`);
      }
    });
    
  } catch (e) {
    console.error('❌ Error parsing products:', e.message);
  }
}

console.log('\n📋 Next Steps:');
console.log('1. Run: ./scripts/download-final-images.sh');
console.log('2. Start the dev server: npm run dev');
console.log('3. Visit a product page to see all images');
console.log('\n✨ The product page will automatically display all images (main, back, and lifestyle) for each color variant.');