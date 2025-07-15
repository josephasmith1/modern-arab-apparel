#!/usr/bin/env node

/**
 * Download cropped hoodie images from Shopify and add product to data.ts
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('🔧 DOWNLOADING CROPPED HOODIE IMAGES...\n');

// Read the cropped hoodie JSON
const jsonPath = path.join(__dirname, 'modernarab-cropped-hoodie.json');
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const product = jsonData.product;

// Create directory for cropped hoodie images
const imageDir = path.join(__dirname, '..', 'public', 'images', 'modernarab-cropped-hoodie');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Download function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// Map images by color and type
const imageMap = {
  black: {
    main: '',
    back: '',
    lifestyle: []
  },
  'olive-green': {
    main: '',
    back: '',
    lifestyle: []
  }
};

// Process images from JSON
product.images.forEach(image => {
  const filename = path.basename(image.src.split('?')[0]);
  
  if (filename.includes('black-back')) {
    imageMap.black.back = image.src;
  } else if (filename.includes('black-front')) {
    imageMap.black.main = image.src;
  } else if (filename.includes('military-green-back')) {
    imageMap['olive-green'].back = image.src;
  } else if (filename.includes('military-green-front')) {
    imageMap['olive-green'].main = image.src;
  } else {
    // Lifestyle images (no color specific naming)
    imageMap.black.lifestyle.push(image.src);
    imageMap['olive-green'].lifestyle.push(image.src);
  }
});

// Download all images
async function downloadAllImages() {
  const downloads = [];
  
  // Download black images
  if (imageMap.black.main) {
    const mainPath = path.join(imageDir, 'black-main.jpg');
    downloads.push(downloadImage(imageMap.black.main, mainPath));
    console.log('📥 Downloading black main image...');
  }
  
  if (imageMap.black.back) {
    const backPath = path.join(imageDir, 'black-back.jpg');
    downloads.push(downloadImage(imageMap.black.back, backPath));
    console.log('📥 Downloading black back image...');
  }
  
  // Download olive green images
  if (imageMap['olive-green'].main) {
    const mainPath = path.join(imageDir, 'olive-green-main.jpg');
    downloads.push(downloadImage(imageMap['olive-green'].main, mainPath));
    console.log('📥 Downloading olive green main image...');
  }
  
  if (imageMap['olive-green'].back) {
    const backPath = path.join(imageDir, 'olive-green-back.jpg');
    downloads.push(downloadImage(imageMap['olive-green'].back, backPath));
    console.log('📥 Downloading olive green back image...');
  }
  
  // Download lifestyle images with unique names
  let lifestyleCount = 1;
  for (const lifestyleUrl of imageMap.black.lifestyle) {
    const lifestylePath = path.join(imageDir, `lifestyle-${lifestyleCount}.jpg`);
    downloads.push(downloadImage(lifestyleUrl, lifestylePath));
    console.log(`📥 Downloading lifestyle image ${lifestyleCount}...`);
    lifestyleCount++;
  }
  
  try {
    await Promise.all(downloads);
    console.log('\n✅ All images downloaded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error downloading images:', error);
    return false;
  }
}

// Generate product data
function generateProductData() {
  const sizes = ['S', 'M', 'L', 'XL', '2XL'];
  const lifestyleImages = [];
  
  // Build lifestyle array based on downloaded images
  for (let i = 1; i <= imageMap.black.lifestyle.length; i++) {
    lifestyleImages.push(`/images/modernarab-cropped-hoodie/lifestyle-${i}.jpg`);
  }
  
  return {
    slug: "modernarab-cropped-hoodie",
    name: "Modern Arab Cropped Hoodie",
    vendor: "Modern Arab Apparel",
    collection: "Layers",
    tags: ["Arabic", "Crop top", "Cropped hoodie", "Hoodie", "Men", "Minimalist", "Modern", "Streetwear", "Sweater", "Unisex", "Western Apparel", "Women"],
    price: "from $65.00",
    originalPrice: "",
    description: "Rooted in meaning and made for movement, the Modern Arab Cropped Hoodie features the Arabic phrase \"ألآ تخافون من الله\" (Don't you fear God?) across the back—a powerful rhetorical question meant to inspire reflection, not fear.",
    fullDescription: product.body_html,
    features: [],
    specifications: [],
    origin: [],
    careInstructions: [],
    sizes: sizes,
    colors: [
      {
        name: "Black",
        swatch: "",
        hex: "#000000",
        images: {
          main: "/images/modernarab-cropped-hoodie/black-main.jpg",
          back: "/images/modernarab-cropped-hoodie/black-back.jpg",
          lifestyle: lifestyleImages
        },
        variants: sizes.map(size => {
          const variant = product.variants.find(v => v.option1 === "Black" && v.option2 === size);
          return {
            size: size,
            price: parseFloat(variant.price),
            sku: variant.sku,
            available: true
          };
        })
      },
      {
        name: "Olive Green",
        swatch: "",
        hex: "#6B8E23",
        images: {
          main: "/images/modernarab-cropped-hoodie/olive-green-main.jpg",
          back: "/images/modernarab-cropped-hoodie/olive-green-back.jpg",
          lifestyle: lifestyleImages
        },
        variants: sizes.map(size => {
          const variant = product.variants.find(v => v.option1 === "Olive Green" && v.option2 === size);
          return {
            size: size,
            price: parseFloat(variant.price),
            sku: variant.sku,
            available: true
          };
        })
      }
    ]
  };
}

// Add to data.ts
function addToDataFile(productData) {
  const dataPath = path.join(__dirname, '..', 'src', 'app', 'products', 'data.ts');
  let dataContent = fs.readFileSync(dataPath, 'utf8');
  
  // Find the end of the products array
  const lastProductIndex = dataContent.lastIndexOf('  }');
  const insertPosition = dataContent.indexOf('];', lastProductIndex);
  
  if (insertPosition === -1) {
    console.error('❌ Could not find products array end');
    return false;
  }
  
  // Format the product data as TypeScript
  const productString = JSON.stringify(productData, null, 2)
    .replace(/^/gm, '  ') // Indent with 2 spaces
    .replace(/^  /, '  '); // Fix first line indentation
  
  // Insert the new product
  const beforeArray = dataContent.substring(0, insertPosition);
  const afterArray = dataContent.substring(insertPosition);
  
  const newContent = beforeArray + ',\n' + productString + '\n' + afterArray;
  
  fs.writeFileSync(dataPath, newContent);
  console.log('✅ Added cropped hoodie to data.ts');
  return true;
}

// Main execution
async function main() {
  const downloadSuccess = await downloadAllImages();
  
  if (downloadSuccess) {
    const productData = generateProductData();
    addToDataFile(productData);
    
    console.log('\n🎉 CROPPED HOODIE SETUP COMPLETE!');
    console.log('📊 Summary:');
    console.log(`   - Downloaded ${imageMap.black.lifestyle.length + 4} images`);
    console.log('   - Added product to data.ts');
    console.log('   - 2 colors: Black, Olive Green');
    console.log('   - 5 sizes: S, M, L, XL, 2XL');
  } else {
    console.log('❌ Failed to download images, skipping data.ts update');
  }
}

main().catch(console.error);