const { chromium } = require('playwright');

async function testColorExtraction() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🎨 Testing dynamic background color extraction...\n');

  // Visit a collection page
  await page.goto('http://localhost:3000/collections/upperwear', { waitUntil: 'networkidle' });
  
  console.log('✅ Page loaded');
  
  // Wait for color extraction to complete
  await page.waitForTimeout(3000);
  
  // Check if product cards have custom background colors
  const productCards = await page.locator('[class*="relative h-96"]').all();
  console.log(`📦 Found ${productCards.length} product cards`);
  
  // Check background colors
  for (let i = 0; i < Math.min(3, productCards.length); i++) {
    const bgColor = await productCards[i].evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    console.log(`  Card ${i + 1} background: ${bgColor}`);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'collection-dynamic-bg.png', fullPage: true });
  console.log('\n📸 Screenshot saved as collection-dynamic-bg.png');
  
  // Visit another collection
  await page.goto('http://localhost:3000/collections/headwear', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'collection-headwear-dynamic-bg.png', fullPage: true });
  console.log('📸 Headwear collection screenshot saved');
  
  // Keep browser open for viewing
  await page.waitForTimeout(5000);
  
  await browser.close();
  
  console.log('\n✅ Color extraction test completed!');
}

testColorExtraction().catch(console.error);