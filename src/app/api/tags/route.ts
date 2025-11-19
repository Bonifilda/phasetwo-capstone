import { NextResponse } from 'next/server'
import { z } from 'zod'

import { connectToDatabase } from '@/lib/db'
import { TagModel } from '@/lib/models/Tag'
import { generateSlug } from '@/lib/utils'
import { requireSession } from '@/lib/auth/session'

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 20)
  const search = searchParams.get('search')

  await connectToDatabase()

  const filter = search
    ? {
        name: { $regex: search, $options: 'i' },
      }
    : {}

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    TagModel.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    TagModel.countDocuments(filter),
  ])

  return NextResponse.json({
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + data.length < total,
    },
  })
}

export async function POST(request: Request) {
  try {
    await requireSession()
    const body = await request.json()
    const data = createSchema.parse(body)

    await connectToDatabase()
    const tag = await TagModel.create({
      ...data,
      slug: generateSlug(data.name),
    })

    return NextResponse.json({ tag }, { status: 201 })
  } catch (error) {
    console.error('[TAG_CREATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

