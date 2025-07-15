const https = require('https');
const fs = require('fs');
const path = require('path');

// Green cap back image URL from Shopify
const imageUrl = 'https://cdn.shopify.com/s/files/1/0656/3512/3366/files/classic-dad-hat-spruce-back-67ca2b4edd9a1.jpg?v=1751093396';
const outputPath = path.join(__dirname, '../public/images/modern-arab-cap/green-back.jpg');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Download the image
console.log('Downloading green cap back image...');
console.log('From:', imageUrl);
console.log('To:', outputPath);

const file = fs.createWriteStream(outputPath);

https.get(imageUrl, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: ${response.statusCode} ${response.statusMessage}`);
    return;
  }

  response.pipe(file);

  file.on('finish', () => {
    file.close();
    console.log('Successfully downloaded green cap back image!');
    
    // Verify the file exists and has content
    const stats = fs.statSync(outputPath);
    console.log(`File size: ${stats.size} bytes`);
  });
}).on('error', (err) => {
  fs.unlink(outputPath, () => {}); // Delete the file on error
  console.error('Download failed:', err.message);
});