const { chromium } = require('playwright');

async function testSimpleEdge() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('🎨 Testing simple edge color detection...\n');

  // Enable console logging from the page
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Page error:', msg.text());
    }
  });

  // Visit a collection page
  await page.goto('http://localhost:3000/collections/upperwear', { waitUntil: 'networkidle' });
  
  console.log('✅ Page loaded');
  
  // Wait for color extraction to complete
  await page.waitForTimeout(3000);
  
  // Check background styles
  const firstCard = await page.locator('.relative.h-96').first();
  const bgStyle = await firstCard.evaluate(el => {
    const computed = window.getComputedStyle(el);
    return {
      background: computed.background,
      backgroundColor: computed.backgroundColor
    };
  });
  
  console.log('Background style:', bgStyle);
  
  // Take screenshot
  await page.screenshot({ path: 'collection-simple-edge.png', fullPage: true });
  console.log('\n📸 Screenshot saved as collection-simple-edge.png');
  
  // Keep browser open for viewing
  await page.waitForTimeout(5000);
  
  await browser.close();
  
  console.log('\n✅ Test completed!');
}

testSimpleEdge().catch(console.error);