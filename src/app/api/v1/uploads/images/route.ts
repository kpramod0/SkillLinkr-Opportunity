import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { createAdminClient } from '@/lib/supabase-server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const applyWatermark = formData.get('watermark') === 'true'
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }
    
    // Strict MIME type checking
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, and WebP images are allowed' }, { status: 400 })
    }
    
    // Convert to buffer for processing
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024
    if (buffer.length > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 })
    }
    
    const image = sharp(buffer)
    // Optionally strip EXIF metadata

    
    // We would normally add a watermark here if applyWatermark is true
    // For now we just process the 3 variants
    
    // Create variants (optimized WebP)
    const [large, medium, thumbnail] = await Promise.all([
      // Large: 1200x1500 (4:5 ratio max)
      image.clone().resize(1200, 1500, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
      // Medium: 600x750
      image.clone().resize(600, 750, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer(),
      // Thumbnail: 300x375
      image.clone().resize(300, 375, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 60 }).toBuffer(),
    ])
    
    const supabase = await createAdminClient()
    const uniqueId = uuidv4()
    const datePrefix = new Date().toISOString().split('T')[0]
    const basePath = `${datePrefix}/${uniqueId}`
    
    // Upload variants to Supabase Storage
    const uploadTasks = [
      supabase.storage.from('opportunity-images').upload(`${basePath}/large.webp`, large, { contentType: 'image/webp' }),
      supabase.storage.from('opportunity-images').upload(`${basePath}/medium.webp`, medium, { contentType: 'image/webp' }),
      supabase.storage.from('opportunity-images').upload(`${basePath}/thumbnail.webp`, thumbnail, { contentType: 'image/webp' })
    ]
    
    const results = await Promise.all(uploadTasks)
    
    // Check for errors
    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('Storage upload errors:', errors)
      return NextResponse.json({ error: 'Failed to upload processed images to storage' }, { status: 500 })
    }
    
    // Get public URLs
    const getUrl = (path: string) => supabase.storage.from('opportunity-images').getPublicUrl(path).data.publicUrl
    
    return NextResponse.json({ 
      success: true,
      urls: {
        large: getUrl(`${basePath}/large.webp`),
        medium: getUrl(`${basePath}/medium.webp`),
        thumbnail: getUrl(`${basePath}/thumbnail.webp`)
      }
    })
  } catch (err: unknown) {
    console.error('Image processing pipeline error:', err)
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
