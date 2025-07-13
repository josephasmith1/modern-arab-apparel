const { chromium } = require('playwright');

async function testFinalFix() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🔍 Testing final collection page fix...\n');

  // Visit the upperwear collection page
  await page.goto('http://localhost:3000/collections/upperwear', { waitUntil: 'networkidle' });
  
  // Count products
  const productCards = await page.locator('a[href*="/products/"]').count();
  console.log(`✅ Product cards found: ${productCards}`);
  
  // Check single vs multi-color products
  const singleColorProducts = await page.locator(':has-text("Faded Bone"):has-text("Faded Green")').count();
  console.log(`✅ Products with multiple color swatches: ${singleColorProducts}`);
  
  const colorTextProducts = await page.locator('.text-sm.text-gray-600.font-barlow-condensed').count();
  console.log(`✅ Products with single color text: ${colorTextProducts}`);
  
  // Take screenshot
  await page.screenshot({ path: 'collection-final-fixed.png', fullPage: true });
  console.log('\n📸 Screenshot saved as collection-final-fixed.png');
  
  // Check specific products
  console.log('\n📋 Checking specific products:');
  const productNames = await page.locator('h3.text-xl').allTextContents();
  productNames.slice(0, 5).forEach((name, i) => {
    console.log(`  ${i + 1}. ${name}`);
  });
  
  // Keep browser open for viewing
  await page.waitForTimeout(5000);
  
  await browser.close();
}

testFinalFix().catch(console.error);