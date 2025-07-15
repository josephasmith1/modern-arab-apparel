const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to download an image
function downloadImage(imageUrl, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(__dirname, '..', destPath);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const file = fs.createWriteStream(fullPath);
    
    https.get(imageUrl, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(fullPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Based on the product data and missing paths, here are the images we need:
const imagesToDownload = [
  // Modern Arab Bucket Hat - Olive
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/organic-bucket-hat-dill-front-67ca39406a72d.jpg?v=1750419501',
    path: 'public/images/modern-arab-bucket-hat/olive-main.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/organic-bucket-hat-dill-product-details-67ca39406a66d.jpg?v=1750419501',
    path: 'public/images/modern-arab-bucket-hat/olive-back.jpg'
  },
  
  // Modern Arab Bucket Hat - Blue (already have main and lifestyle, need back)
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/organic-bucket-hat-slate-blue-product-details-67ca39406a596.jpg?v=1750419501',
    path: 'public/images/modern-arab-bucket-hat/blue-back.jpg'
  },
  
  // Modern Arab Bucket Hat - Black
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/organic-bucket-hat-black-front-67ca3940698a1.jpg?v=1746356436',
    path: 'public/images/modern-arab-bucket-hat/black-main.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/organic-bucket-hat-black-product-details-67ca39406a535.jpg?v=1746356436',
    path: 'public/images/modern-arab-bucket-hat/black-back.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/MG_0375.jpg?v=1746356436',
    path: 'public/images/modern-arab-bucket-hat/black-lifestyle-1.jpg'
  },
  
  // Modern Arab Bucket Hat - Khaki  
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/organic-bucket-hat-stone-front-67ca39406a81f.jpg?v=1746356436',
    path: 'public/images/modern-arab-bucket-hat/khaki-main.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/organic-bucket-hat-stone-product-details-67ca39406a5f0.jpg?v=1746356436',
    path: 'public/images/modern-arab-bucket-hat/khaki-back.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/2-_DSC9208_705adecc-e80a-46f9-be74-7ccdf0e48a57.jpg?v=1746356436',
    path: 'public/images/modern-arab-bucket-hat/khaki-lifestyle-1.jpg'
  }
];

// Download all images
async function downloadAll() {
  console.log('Starting download of missing bucket hat images...\n');
  
  for (const image of imagesToDownload) {
    try {
      await downloadImage(image.url, image.path);
    } catch (error) {
      console.error(`Failed to download ${image.path}:`, error.message);
    }
  }
  
  console.log('\nDownload complete!');
}

downloadAll();