import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function GET(request: NextRequest) {
  try {
    const { searchParams, protocol, host } = new URL(request.url);
    let imageUrl = searchParams.get('imageUrl');
    const extractBackground = searchParams.get('extractBackground') === 'true';

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (imageUrl.startsWith('/')) {
      imageUrl = `${protocol}//${host}${imageUrl}`;
    }

    return await processImageColor(imageUrl, extractBackground);
  } catch (error) {
    console.error('Error in GET extract-color:', error);
    return NextResponse.json(
      { error: 'Failed to extract color' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let imageUrl = body.imageUrl;
    const extractBackground = body.extractBackground ?? false;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (imageUrl.startsWith('/')) {
      const url = new URL(request.url);
      imageUrl = `${url.protocol}//${url.host}${imageUrl}`;
    }

    return await processImageColor(imageUrl, extractBackground);
  } catch (error) {
    console.error('Error in POST extract-color:', error);
    return NextResponse.json(
      { error: 'Failed to extract color' },
      { status: 500 }
    );
  }
}

async function processImageColor(imageUrl: string, extractBackground: boolean = false) {
  try {
    console.log('Processing image:', imageUrl, 'extractBackground:', extractBackground);
    
    // Fetch the image with proper headers to avoid CORS issues
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Image buffer size:', buffer.length);
    
    // Extract color based on mode
    const color = extractBackground 
      ? await extractBackgroundColor(buffer)
      : await extractDominantColor(buffer);
    console.log('Extracted color:', color);
    
    return NextResponse.json({ color });
  } catch (error) {
    console.error('Error extracting color:', error);
    return NextResponse.json(
      { error: 'Failed to extract color', details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function extractBackgroundColor(buffer: Buffer): Promise<string> {
  try {
    // Get image metadata to know dimensions
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;
    
    // Resize for faster processing
    const { data, info } = await sharp(buffer)
      .resize(100, 100, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Sample corners of the image
    const cornerSize = 5; // Sample 5x5 pixel area in each corner
    const corners = [
      { x: 0, y: 0 }, // top-left
      { x: info.width - cornerSize, y: 0 }, // top-right
      { x: 0, y: info.height - cornerSize }, // bottom-left
      { x: info.width - cornerSize, y: info.height - cornerSize } // bottom-right
    ];
    
    const cornerColors: Array<{r: number, g: number, b: number}> = [];
    const bytesPerPixel = info.channels;
    
    // Extract colors from each corner
    for (const corner of corners) {
      for (let y = corner.y; y < corner.y + cornerSize && y < info.height; y++) {
        for (let x = corner.x; x < corner.x + cornerSize && x < info.width; x++) {
          const idx = (y * info.width + x) * bytesPerPixel;
          cornerColors.push({
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2]
          });
        }
      }
    }
    
    // Find the most common color among corners (likely the background)
    // For simplicity, we'll average all corner pixels
    const avgColor = cornerColors.reduce(
      (acc, pixel) => {
        acc.r += pixel.r;
        acc.g += pixel.g;
        acc.b += pixel.b;
        return acc;
      },
      { r: 0, g: 0, b: 0 }
    );
    
    const count = cornerColors.length || 1;
    return `rgb(${Math.round(avgColor.r / count)}, ${Math.round(avgColor.g / count)}, ${Math.round(avgColor.b / count)})`;
  } catch (error) {
    console.error('Error in background color extraction:', error);
    return 'rgb(240, 237, 236)'; // Fallback to page background color
  }
}

async function extractDominantColor(buffer: Buffer): Promise<string> {
  try {
    // First, get image metadata to know dimensions
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1000;
    const height = metadata.height || 1000;
    
    // Extract center region (40% of the image) where the product usually is
    const cropSize = Math.min(width, height) * 0.4;
    const left = Math.floor((width - cropSize) / 2);
    const top = Math.floor((height - cropSize) / 2);
    
    // Extract the center region and resize for processing
    const { data, info } = await sharp(buffer)
      .extract({ 
        left: left, 
        top: top, 
        width: Math.floor(cropSize), 
        height: Math.floor(cropSize) 
      })
      .resize(100, 100)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    // Analyze pixels to find non-white/non-background colors
    const pixels: Array<{r: number, g: number, b: number}> = [];
    const bytesPerPixel = info.channels;
    
    for (let i = 0; i < data.length; i += bytesPerPixel) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Skip white/very light pixels (background)
      const brightness = (r + g + b) / 3;
      if (brightness < 240) { // Not white/near-white
        pixels.push({ r, g, b });
      }
    }
    
    if (pixels.length === 0) {
      // If all pixels are white, try the whole image
      const { dominant } = await sharp(buffer)
        .resize(100, 100, { fit: 'cover' })
        .stats();
      
      if (dominant) {
        return `rgb(${Math.round(dominant.r)}, ${Math.round(dominant.g)}, ${Math.round(dominant.b)})`;
      }
    }
    
    // Calculate average color of non-white pixels
    const avgColor = pixels.reduce(
      (acc, pixel) => {
        acc.r += pixel.r;
        acc.g += pixel.g;
        acc.b += pixel.b;
        return acc;
      },
      { r: 0, g: 0, b: 0 }
    );
    
    const count = pixels.length || 1;
    return `rgb(${Math.round(avgColor.r / count)}, ${Math.round(avgColor.g / count)}, ${Math.round(avgColor.b / count)})`;
  } catch (error) {
    console.error('Error in color extraction:', error);
    return 'rgb(120, 120, 120)'; // Fallback gray
  }
}