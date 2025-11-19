import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { CommentModel } from '@/lib/models/Comment'

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
    CommentModel.find({ author: params.id })
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments({ author: params.id }),
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

