import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { LikeModel } from '@/lib/models/Like'

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params }: Params) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)

  await connectToDatabase()

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    LikeModel.find({ user: params.id })
      .populate({
        path: 'post',
        populate: { path: 'author', select: 'name username avatar' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    LikeModel.countDocuments({ user: params.id }),
  ])

  return NextResponse.json({
    likes: data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + data.length < total,
    },
  })
}

