import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { TagModel } from '@/lib/models/Tag'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const limit = Number(searchParams.get('limit') || 10)

  await connectToDatabase()

  const filter = query
    ? {
        name: { $regex: query, $options: 'i' },
      }
    : {}

  const tags = await TagModel.find(filter).limit(limit).lean()

  return NextResponse.json({ tags })
}

