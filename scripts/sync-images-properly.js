const fs = require('fs');
const path = require('path');

// Function to copy all images from scripts/public/images to main public/images
function syncImages() {
  const sourceDir = path.join(__dirname, 'public/images');
  const targetDir = path.join(__dirname, '../public/images');
  
  if (!fs.existsSync(sourceDir)) {
    console.error('Source directory does not exist:', sourceDir);
    return;
  }
  
  // Get all product directories
  const productDirs = fs.readdirSync(sourceDir).filter(item => {
    const fullPath = path.join(sourceDir, item);
    return fs.statSync(fullPath).isDirectory();
  });
  
  console.log(`Found ${productDirs.length} product directories to sync`);
  
  let totalCopied = 0;
  let totalSkipped = 0;
  
  productDirs.forEach(productDir => {
    const sourceProdDir = path.join(sourceDir, productDir);
    const targetProdDir = path.join(targetDir, productDir);
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetProdDir)) {
      fs.mkdirSync(targetProdDir, { recursive: true });
      console.log(`Created directory: ${productDir}`);
    }
    
    // Get all images in the source directory
    const images = fs.readdirSync(sourceProdDir).filter(file => 
      file.endsWith('.jpg') || file.endsWith('.png')
    );
    
    images.forEach(image => {
      const sourceFile = path.join(sourceProdDir, image);
      const targetFile = path.join(targetProdDir, image);
      
      // Only copy if file doesn't exist or is different
      if (!fs.existsSync(targetFile)) {
        fs.copyFileSync(sourceFile, targetFile);
        console.log(`  Copied: ${productDir}/${image}`);
        totalCopied++;
      } else {
        totalSkipped++;
      }
    });
  });
  
  console.log(`\n✅ Sync complete:`);
  console.log(`   - Copied ${totalCopied} new images`);
  console.log(`   - Skipped ${totalSkipped} existing images`);
  console.log(`   - Total directories: ${productDirs.length}`);
}

// Run the sync
syncImages();