#!/bin/bash

# Download images in parallel for faster execution
echo "Starting parallel image download..."

# Create all directories first
cat download-shopify-images-direct.sh | grep "mkdir -p" | while read cmd; do
  eval "$cmd"
done

# Download images in parallel (10 at a time)
cat download-shopify-images-direct.sh | grep "curl" | xargs -P 10 -I {} bash -c '{}'

echo "Download complete!"