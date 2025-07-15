import { NextResponse } from 'next/server';
import { products } from '@/data/products/sync';

export async function GET() {
  try {
    
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error loading products:', error);
    
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}