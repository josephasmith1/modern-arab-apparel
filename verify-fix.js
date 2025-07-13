const { chromium } = require('playwright');

async function verifyFix() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🔍 Verifying the fix for duplicate products...\n');

  // Visit the upperwear collection page
  await page.goto('http://localhost:3000/collections/upperwear', { waitUntil: 'networkidle' });
  
  // Count product cards
  const productCards = await page.locator('a[href*="/products/"]').count();
  console.log(`✅ Product cards found: ${productCards}`);
  
  // Check for Modern Arab Faded Tee
  const fadedTeeCards = await page.locator('h3:has-text("Modern Arab Faded Tee")').count();
  console.log(`✅ Modern Arab Faded Tee instances: ${fadedTeeCards}`);
  
  // Check color swatches on the first Faded Tee
  const firstFadedTee = await page.locator('h3:has-text("Modern Arab Faded Tee")').first();
  const cardContainer = await firstFadedTee.locator('..').locator('..');
  const colorSwatches = await cardContainer.locator('[title]').count();
  console.log(`✅ Color swatches on Modern Arab Faded Tee: ${colorSwatches}`);
  
  // Take a screenshot
  await page.screenshot({ path: 'upperwear-fixed.png', fullPage: true });
  console.log('\n📸 Screenshot saved as upperwear-fixed.png');
  
  // Also check the frontpage
  await page.goto('http://localhost:3000/collections/frontpage', { waitUntil: 'networkidle' });
  const frontpageProducts = await page.locator('a[href*="/products/"]').count();
  console.log(`\n✅ Frontpage products: ${frontpageProducts} (was 22, now should be less)`);
  
  await page.screenshot({ path: 'frontpage-fixed.png', fullPage: true });
  console.log('📸 Screenshot saved as frontpage-fixed.png');
  
  // Keep browser open for 5 seconds to view
  await page.waitForTimeout(5000);
  
  await browser.close();
}

verifyFix().catch(console.error);