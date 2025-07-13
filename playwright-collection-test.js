const { chromium } = require('playwright');

async function testCollectionPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Define all collection pages to test
  const collections = [
    { name: 'Frontpage', slug: 'frontpage' },
    { name: 'Tops', slug: 'upperwear' },
    { name: 'Layers', slug: 'layers' },
    { name: 'Headwear', slug: 'headwear' },
    { name: 'Arrivals', slug: 'coming-soon' },
    { name: 'Bottoms', slug: 'bottoms' }
  ];

  const baseUrl = 'http://localhost:3000';
  const results = [];

  console.log('🚀 Starting collection page verification...\n');

  for (const collection of collections) {
    const url = `${baseUrl}/collections/${collection.slug}`;
    console.log(`📄 Testing: ${collection.name} (${collection.slug})`);
    console.log(`🔗 URL: ${url}`);

    try {
      // Navigate to the page
      const response = await page.goto(url, { waitUntil: 'networkidle' });
      
      const issues = [];

      // Check HTTP status
      if (!response.ok()) {
        issues.push(`❌ HTTP Error: ${response.status()} ${response.statusText()}`);
      }

      // Check for page title
      const title = await page.title();
      console.log(`📋 Page Title: ${title}`);

      // Check if collection header is present
      const collectionHeader = await page.locator('h1').first();
      const headerText = await collectionHeader.textContent();
      console.log(`🏷️  Collection Header: ${headerText}`);

      // Check for products grid
      const productsGrid = await page.locator('[class*="grid"]').count();
      console.log(`🔲 Grid containers found: ${productsGrid}`);

      // Count product cards
      const productCards = await page.locator('a[href*="/products/"]').count();
      console.log(`🛍️  Product cards found: ${productCards}`);

      // Check for missing images (404 errors)
      const images = await page.locator('img').all();
      let imageErrors = 0;
      
      for (const img of images) {
        try {
          const src = await img.getAttribute('src');
          if (src && src.startsWith('/')) {
            // Check if local image exists by trying to load it
            const imgResponse = await page.request.get(`${baseUrl}${src}`);
            if (!imgResponse.ok()) {
              imageErrors++;
              if (imageErrors <= 3) { // Only log first 3 to avoid spam
                issues.push(`🖼️  Missing image: ${src} (${imgResponse.status()})`);
              }
            }
          }
        } catch (e) {
          // Skip broken image checks
        }
      }

      if (imageErrors > 3) {
        issues.push(`🖼️  Additional ${imageErrors - 3} image errors...`);
      }

      // Check for JavaScript errors
      const jsErrors = [];
      page.on('pageerror', error => {
        jsErrors.push(error.message);
      });

      // Check console errors
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Wait a bit for any async errors to surface
      await page.waitForTimeout(1000);

      if (jsErrors.length > 0) {
        issues.push(`🚨 JavaScript errors: ${jsErrors.length}`);
        jsErrors.forEach(error => issues.push(`   - ${error}`));
      }

      if (consoleErrors.length > 0) {
        issues.push(`⚠️  Console errors: ${consoleErrors.length}`);
        consoleErrors.slice(0, 3).forEach(error => issues.push(`   - ${error}`));
      }

      // Check if "Coming Soon" message appears when no products
      if (productCards === 0) {
        const comingSoonText = await page.getByText('Products Coming Soon').count();
        if (comingSoonText > 0) {
          issues.push(`ℹ️  No products - showing "Coming Soon" message`);
        } else {
          issues.push(`❌ No products found and no "Coming Soon" message`);
        }
      }

      // Check breadcrumb navigation
      const breadcrumbs = await page.locator('nav ol li').count();
      console.log(`🍞 Breadcrumb items: ${breadcrumbs}`);

      // Check footer presence
      const footer = await page.locator('footer').count();
      if (footer === 0) {
        issues.push(`❌ Footer not found`);
      }

      results.push({
        collection: collection.name,
        slug: collection.slug,
        url,
        status: response.status(),
        title,
        headerText,
        productCards,
        issues,
        success: issues.filter(i => i.startsWith('❌')).length === 0
      });

      if (issues.length === 0) {
        console.log(`✅ No issues found`);
      } else {
        console.log(`⚠️  Issues found:`);
        issues.forEach(issue => console.log(`   ${issue}`));
      }

    } catch (error) {
      console.log(`❌ Failed to load page: ${error.message}`);
      results.push({
        collection: collection.name,
        slug: collection.slug,
        url,
        error: error.message,
        success: false
      });
    }

    console.log('─'.repeat(80));
  }

  await browser.close();

  // Summary report
  console.log('\n📊 COLLECTION PAGES VERIFICATION SUMMARY');
  console.log('═'.repeat(80));

  const successful = results.filter(r => r.success).length;
  const failed = results.length - successful;

  console.log(`✅ Successful: ${successful}/${results.length}`);
  console.log(`❌ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log('\n🚨 PAGES WITH ISSUES:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`\n📄 ${result.collection} (${result.slug})`);
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      } else if (result.issues) {
        result.issues.forEach(issue => console.log(`   ${issue}`));
      }
    });
  }

  console.log('\n📈 DETAILED RESULTS:');
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.collection}: ${result.productCards} products`);
    } else {
      console.log(`❌ ${result.collection}: Issues found`);
    }
  });

  return results;
}

// Run the test
testCollectionPages().catch(console.error);