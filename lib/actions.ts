'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
})

export async function uploadMedia(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const title = formData.get('title') as string
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const districtOrigin = formData.get('district_origin') as string
  const file = formData.get('file') as File

  if (!title || !category || !file) {
    return { error: 'Missing required fields' }
  }

  // Validate file size (100MB max)
  if (file.size > 100 * 1024 * 1024) {
    return { error: 'File size exceeds 100MB limit' }
  }

  try {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const arrayBuffer = await file.arrayBuffer()

    // Upload to R2 using AWS SDK
    const command = new PutObjectCommand({
      Bucket: 'wambule',
      Key: filename,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type || 'application/octet-stream',
    })

    await s3Client.send(command)

    // Construct public URL
    const mediaPath = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${filename}`

    // Create media hub entry in Supabase
    const { error: dbError } = await supabase.from('media_hub').insert([
      {
        community_slug: 'wambule',
        title,
        category,
        description: description || null,
        media_path: mediaPath,
        district_origin: districtOrigin || null,
        user_id: user.id,
        status: 'pending',
      },
    ])

    if (dbError) {
      return { error: `Database error: ${dbError.message}` }
    }

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('Upload error:', error)
    return { error: `Upload failed: ${error.message}` }
  }
}
