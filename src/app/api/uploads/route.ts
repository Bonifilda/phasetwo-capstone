import { NextResponse } from 'next/server'
import { Readable } from 'stream'

import { cloudinary } from '@/lib/cloudinary'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  if (!cloudinary.config().cloud_name) {
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const uploadResult = await new Promise<{
      secure_url: string
      public_id: string
      width: number
      height: number
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: formData.get('folder')?.toString() || 'medium-platform/uploads',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Unknown upload error'))
            return
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width ?? 0,
            height: result.height ?? 0,
          })
        }
      )

      Readable.from(buffer).pipe(stream)
    })

    return NextResponse.json({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
    })
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

