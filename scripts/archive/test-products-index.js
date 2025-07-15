/**
 * Test script to verify the new products index loads correctly
 */

// Use dynamic import since this is a .js file importing TypeScript
async function testProductsIndex() {
  try {
    console.log('Testing products index loading...\n');
    
    // Dynamic import the products index
    const { products, findProductBySlug, getCollections, getTags } = await import('../src/data/products/index.ts');
    
    console.log(`Total products loaded: ${products.length}`);
    console.log('\nFirst 3 products:');
    products.slice(0, 3).forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} (${product.slug})`);
      console.log(`   Collection: ${product.collection}`);
      console.log(`   Price: ${product.price}`);
      console.log(`   Colors: ${product.colors.map(c => c.name).join(', ')}`);
      console.log('');
    });
    
    // Test finding a product by slug
    console.log('\nTesting findProductBySlug:');
    const beanie = findProductBySlug('fisherman-beanie');
    if (beanie) {
      console.log(`Found: ${beanie.name} - ${beanie.description.substring(0, 50)}...`);
    } else {
      console.log('Beanie not found');
    }
    
    // Test collections
    console.log('\nCollections:', getCollections().join(', '));
    
    // Test tags
    console.log('\nUnique tags:', getTags().join(', '));
    
    // Verify each product has required fields
    console.log('\nValidating product structure...');
    let valid = true;
    products.forEach((product, index) => {
      const requiredFields = ['slug', 'name', 'vendor', 'collection', 'price', 'description', 'colors'];
      const missingFields = requiredFields.filter(field => !product[field]);
      
      if (missingFields.length > 0) {
        console.log(`Product ${index} (${product.name || 'Unknown'}) missing fields:`, missingFields);
        valid = false;
      }
      
      if (product.colors.length === 0) {
        console.log(`Product ${index} (${product.name}) has no colors`);
        valid = false;
      }
    });
    
    if (valid) {
      console.log('All products have valid structure ✓');
    }
    
    console.log('\n✅ Products index test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing products index:', error);
    process.exit(1);
  }
}

// Run the test
testProductsIndex();