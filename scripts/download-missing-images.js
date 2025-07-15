const fs = require('fs');
const path = require('path');
const https = require('https');

// Key image URLs from the Shopify data
const imagesToDownload = [
  // Fisherman beanie images
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/fisherman-beanie-cypress-front-67cbbf1c8eb88.jpg?v=1746352596',
    path: 'public/images/fisherman-beanie/cypress-main.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/fisherman-beanie-black-front-67cbbf1c8de09.jpg?v=1746352596',
    path: 'public/images/fisherman-beanie/black-main.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/fisherman-beanie-ecru-front-67d1276ae6133.jpg?v=1750416803',
    path: 'public/images/fisherman-beanie/ecru-main.jpg'
  },
  {
    url: 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/fisherman-beanie-petrol-blue-front-67d127ad708f6.jpg?v=1750416845',
    path: 'public/images/fisherman-beanie/petrol-blue-main.jpg'
  }
];

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

// Download all images
async function downloadAll() {
  console.log('Starting download of missing images...\n');
  
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