const { chromium } = require('playwright');

async function testNoSwatches() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🔍 Testing collection page without color swatches...\n');

  // Visit the upperwear collection page
  await page.goto('http://localhost:3000/collections/upperwear', { waitUntil: 'networkidle' });
  
  // Check for color swatches
  const colorSwatches = await page.locator('[title][style*="backgroundColor"]').count();
  console.log(`✅ Color swatches found: ${colorSwatches} (should be 0)`);
  
  // Count product cards
  const productCards = await page.locator('a[href*="/products/"]').count();
  console.log(`✅ Product cards found: ${productCards}`);
  
  // Take a screenshot
  await page.screenshot({ path: 'collection-no-swatches.png', fullPage: true });
  console.log('\n📸 Screenshot saved as collection-no-swatches.png');
  
  // Keep browser open for 3 seconds
  await page.waitForTimeout(3000);
  
  await browser.close();
}

testNoSwatches().catch(console.error);