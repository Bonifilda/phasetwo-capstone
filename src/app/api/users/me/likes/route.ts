import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { LikeModel } from '@/lib/models/Like'

export async function GET(request: Request) {
  const session = await requireSession()
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)

  await connectToDatabase()

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    LikeModel.find({ user: session.user.id })
      .populate({
        path: 'post',
        populate: { path: 'author', select: 'name username avatar' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    LikeModel.countDocuments({ user: session.user.id }),
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

