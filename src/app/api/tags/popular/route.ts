import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') || 10)

  await connectToDatabase()
  const aggregation = await PostModel.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ])

  return NextResponse.json({
    tags: aggregation.map((item) => ({ name: item._id, count: item.count })),
  })
}

