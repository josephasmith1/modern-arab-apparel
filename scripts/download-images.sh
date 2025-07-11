#!/bin/bash

# Create images directory
mkdir -p public/images

# Download images from the existing data.ts file
echo "Downloading images from the live site..."

# Modern Arab Faded Tee - Faded Khaki
curl -o "public/images/modern-arab-faded-tee-faded-khaki-front.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-khaki-front-67e7da798329f.jpg"
curl -o "public/images/modern-arab-faded-tee-faded-khaki-back.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-khaki-back-67e7da7983d55.jpg"

# Modern Arab Faded Tee - Faded Black
curl -o "public/images/modern-arab-faded-tee-faded-black-front.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-black-front-67e7da7982b19.jpg"
curl -o "public/images/modern-arab-faded-tee-faded-black-back.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-black-back-67e7da7981a64.jpg"

# Modern Arab Faded Tee - Faded Bone
curl -o "public/images/modern-arab-faded-tee-faded-bone-front.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-bone-front-67e7da7986b74.jpg"
curl -o "public/images/modern-arab-faded-tee-faded-bone-back.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-bone-back-67e7da798836b.jpg"

# Modern Arab Faded Tee - Faded Eucalyptus
curl -o "public/images/modern-arab-faded-tee-faded-eucalyptus-front.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-eucalyptus-front-67e7da7984868.jpg"
curl -o "public/images/modern-arab-faded-tee-faded-eucalyptus-back.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/oversized-faded-t-shirt-faded-eucalyptus-back-67e7da79856a3.jpg"

# Lifestyle images
curl -o "public/images/lifestyle-1.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/IMG-3317.jpg"
curl -o "public/images/lifestyle-2.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/IMG-3331.jpg"
curl -o "public/images/lifestyle-3.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/2171EA9A-09AE-4694-B647-2BE5474FE33C-2.jpg"
curl -o "public/images/lifestyle-4.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/A1A88436-9771-410D-9662-33C0E503738D.jpg"
curl -o "public/images/lifestyle-5.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/IMG-3340.jpg"
curl -o "public/images/lifestyle-6.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/IMG-3330.jpg"
curl -o "public/images/lifestyle-7.jpg" "https://cdn.shopify.com/s/files/1/0656/3512/3366/files/IMG-3339.jpg"

echo "Download complete!"
echo "Images saved to public/images/"
ls -la public/images/