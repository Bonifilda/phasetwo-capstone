import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { FollowModel } from '@/lib/models/Follow'

export async function GET(request: Request) {
  const session = await requireSession()
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)

  await connectToDatabase()

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    FollowModel.find({ follower: session.user.id })
      .populate('following', 'name username avatar headline')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    FollowModel.countDocuments({ follower: session.user.id }),
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

