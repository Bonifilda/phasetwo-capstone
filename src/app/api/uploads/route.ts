import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create unique filename
    const filename = `${Date.now()}-${file.name}`
    const path = join(process.cwd(), 'public/uploads', filename)

    // Save file to public/uploads directory
    await writeFile(path, buffer)

    // Return the public URL
    return NextResponse.json({
      url: `/uploads/${filename}`,
      publicId: filename,
      width: 0,
      height: 0,
    })
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

