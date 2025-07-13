const https = require('https');
const fs = require('fs');

// Function to fetch data
function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function getCollections() {
  console.log('Fetching collections from Shopify...');
  
  // Try to get collections
  const collectionsData = await fetchData('https://modernarabapparel.com/collections.json');
  
  if (collectionsData && collectionsData.collections) {
    fs.writeFileSync('shopify-collections.json', JSON.stringify(collectionsData, null, 2));
    console.log(`✅ Found ${collectionsData.collections.length} collections`);
    
    // For each collection, get its products
    for (const collection of collectionsData.collections) {
      console.log(`\nFetching products for collection: ${collection.title}`);
      const productsUrl = `https://modernarabapparel.com/collections/${collection.handle}/products.json`;
      const productsData = await fetchData(productsUrl);
      
      if (productsData && productsData.products) {
        fs.writeFileSync(`collection-${collection.handle}-products.json`, JSON.stringify(productsData, null, 2));
        console.log(`  ✓ ${productsData.products.length} products`);
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } else {
    console.log('Could not fetch collections. Using product types as collections...');
    
    // Create collections from product types
    const products = JSON.parse(fs.readFileSync('all-products.json', 'utf8')).products;
    const productTypes = [...new Set(products.map(p => p.product_type))];
    
    const collections = productTypes.map(type => ({
      id: type.toLowerCase().replace(/\s+/g, '-'),
      handle: type.toLowerCase().replace(/\s+/g, '-'),
      title: type,
      body_html: '',
      products: products.filter(p => p.product_type === type).map(p => p.handle)
    }));
    
    fs.writeFileSync('shopify-collections.json', JSON.stringify({ collections }, null, 2));
    console.log(`✅ Created ${collections.length} collections from product types`);
  }
}

getCollections().catch(console.error);