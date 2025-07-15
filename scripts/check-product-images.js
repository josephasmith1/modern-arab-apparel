const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(process.cwd(), 'src/data/products');
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public/images');

// Product to folder mappings
const FOLDER_MAPPINGS = {
  'modern-arab-beanie-2': 'modernarab-beanie',
  'modern-arab-crewneck-sand': 'modernarab-crewneck-sand'
};

// Color mappings
const COLOR_MAPPINGS = {
  'olive-green': 'green',
  'faded-black': 'faded-black',
  'faded-bone': 'faded-bone',
  'faded-green': 'faded-green',
  'faded-khaki': 'faded-khaki',
  'olive': 'olive',
  'maroon': 'maroon',
  'white': 'white',
  'blue': 'blue',
  'beige': 'beige',
  'navy': 'navy',
  'gray': 'gray',
  'grey': 'grey'
};

// Product-specific color mappings
const PRODUCT_COLOR_MAPPINGS = {
  'modern-arab-joggers': {
    'black': 'faded-black',
    'olive-green': 'green'
  },
  'modern-arab-beanie-2': {
    'black': 'faded-black'
  },
  'modern-arab-sweatpants': {
    'light-green': 'green',
    'light-blue': 'blue',
    'light-black': 'faded-black',
    'dark-blue': 'blue'
  },
  'modern-arab-hoodie': {
    'bone': 'faded-bone'
  },
  'modern-arab-crewneck-sand': {
    's': 'faded-bone',
    'm': 'faded-bone',
    'l': 'faded-bone',
    'xl': 'faded-bone',
    '2xl': 'faded-bone',
    '3xl': 'faded-bone'
  }
};

function generateColorSlug(colorName, productSlug) {
  const baseSlug = colorName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  
  if (productSlug && PRODUCT_COLOR_MAPPINGS[productSlug]?.[baseSlug]) {
    return PRODUCT_COLOR_MAPPINGS[productSlug][baseSlug];
  }
  
  return COLOR_MAPPINGS[baseSlug] || baseSlug;
}

function getImageFolderName(productSlug) {
  return FOLDER_MAPPINGS[productSlug] || productSlug;
}

function generateImagePaths(colorSlug, folderName) {
  const basePath = `/images/${folderName}/${colorSlug}`;
  
  const paths = {
    main: `${basePath}-main.jpg`,
    back: `${basePath}-back.jpg`,
    lifestyle: [`${basePath}-lifestyle-1.jpg`]
  };
  
  const lifestyleOnlyProducts = [
    'modern-arab-beanie-1',
    'fisherman-beanie',
    'modernarab-beanie'
  ];
  
  if (lifestyleOnlyProducts.includes(folderName)) {
    paths.main = `${basePath}-lifestyle-1.jpg`;
    paths.back = `${basePath}-back.jpg`;
  }
  
  return paths;
}

async function checkAllProducts() {
  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.json'));
  let totalProducts = 0;
  let totalColors = 0;
  let missingImages = [];
  let shopifyUrls = [];

  console.log(`Checking ${files.length} product files...\n`);

  for (const file of files) {
    const filePath = path.join(PRODUCTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const product = data.product;
    
    if (!product) continue;
    
    totalProducts++;
    const productSlug = product.handle;
    const productName = product.title;
    
    console.log(`\n========================================`);
    console.log(`${productName} (${productSlug})`);
    console.log(`========================================`);
    
    // Get unique colors from variants
    const colors = new Set();
    product.variants?.forEach(variant => {
      if (variant.option1) {
        colors.add(variant.option1);
      }
    });
    
    // Check each color
    for (const colorName of colors) {
      totalColors++;
      console.log(`\n  Color: ${colorName}`);
      
      // Generate expected paths
      const colorSlug = generateColorSlug(colorName, productSlug);
      const folderName = getImageFolderName(productSlug);
      const imagePaths = generateImagePaths(colorSlug, folderName);
      
      // Check main image
      const mainPath = path.join(process.cwd(), 'public', imagePaths.main);
      const mainExists = fs.existsSync(mainPath);
      console.log(`    Main: ${imagePaths.main} ${mainExists ? '✅' : '❌ MISSING'}`);
      if (!mainExists) {
        missingImages.push(imagePaths.main);
      }
      
      // Check back image
      const backPath = path.join(process.cwd(), 'public', imagePaths.back);
      const backExists = fs.existsSync(backPath);
      console.log(`    Back: ${imagePaths.back} ${backExists ? '✅' : '❌ MISSING'}`);
      if (!backExists) {
        missingImages.push(imagePaths.back);
      }
      
      // Check lifestyle images
      for (const lifestyle of imagePaths.lifestyle) {
        const lifestylePath = path.join(process.cwd(), 'public', lifestyle);
        const lifestyleExists = fs.existsSync(lifestylePath);
        console.log(`    Lifestyle: ${lifestyle} ${lifestyleExists ? '✅' : '❌ MISSING'}`);
        if (!lifestyleExists) {
          missingImages.push(lifestyle);
        }
      }
      
      // Check if any Shopify URLs would be used
      const variantImages = product.images?.filter(img => 
        img.variant_ids?.some(id => {
          const variant = product.variants.find(v => v.id === id);
          return variant?.option1 === colorName;
        })
      ) || [];
      
      if (variantImages.length > 0) {
        variantImages.forEach(img => {
          if (img.src.includes('cdn.shopify.com')) {
            console.log(`    ⚠️  Has Shopify URL: ${img.src}`);
            shopifyUrls.push(`${productSlug}/${colorName}: ${img.src}`);
          }
        });
      }
    }
  }
  
  // Summary
  console.log('\n\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log(`Total products: ${totalProducts}`);
  console.log(`Total color variants: ${totalColors}`);
  console.log(`Missing images: ${missingImages.length}`);
  console.log(`Products with Shopify URLs: ${shopifyUrls.length > 0 ? 'Yes' : 'No'}`);
  
  if (missingImages.length > 0) {
    console.log('\n❌ MISSING IMAGE FILES:');
    const uniqueMissing = [...new Set(missingImages)];
    uniqueMissing.sort().forEach(img => console.log(`  - ${img}`));
  }
  
  // Save report
  const report = {
    totalProducts,
    totalColors,
    missingImages: [...new Set(missingImages)],
    shopifyUrls
  };
  
  fs.writeFileSync(
    path.join(process.cwd(), 'scripts/image-check-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('\nReport saved to scripts/image-check-report.json');
}

checkAllProducts().catch(console.error);