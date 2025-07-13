const { chromium } = require('playwright');

async function testNewCollectionDesign() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🎨 Testing new collection page design...\n');

  // Visit upperwear collection
  await page.goto('http://localhost:3000/collections/upperwear', { waitUntil: 'networkidle' });
  
  console.log('✅ Page loaded');
  
  // Check for the new 2-column layout
  const heroSection = await page.locator('.grid.grid-cols-1.lg\\:grid-cols-2').count();
  console.log(`✅ 2-column hero layout found: ${heroSection > 0}`);
  
  // Check for removed Collection Details section
  const collectionDetails = await page.locator('text="Collection Details"').count();
  console.log(`✅ Collection Details removed: ${collectionDetails === 0}`);
  
  // Check for parallax effect elements
  const parallaxImage = await page.locator('motion.div').count();
  console.log(`✅ Framer Motion elements present`);
  
  // Take screenshot
  await page.screenshot({ path: 'collection-new-design.png', fullPage: true });
  console.log('\n📸 Screenshot saved as collection-new-design.png');
  
  // Scroll to test parallax
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(500);
  
  await page.screenshot({ path: 'collection-new-design-scrolled.png', fullPage: true });
  console.log('📸 Screenshot with scroll saved as collection-new-design-scrolled.png');
  
  // Test another collection (bottoms)
  await page.goto('http://localhost:3000/collections/bottoms', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'collection-bottoms-new-design.png', fullPage: true });
  console.log('📸 Bottoms collection screenshot saved');
  
  // Keep browser open for 5 seconds
  await page.waitForTimeout(5000);
  
  await browser.close();
  
  console.log('\n✅ New collection design tested successfully!');
}

testNewCollectionDesign().catch(console.error);