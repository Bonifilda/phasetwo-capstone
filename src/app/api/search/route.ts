import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'
import { UserModel } from '@/lib/models/User'
import { TagModel } from '@/lib/models/Tag'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const type = searchParams.get('type') || 'all'

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 })
  }

  await connectToDatabase()

  const results: Record<string, unknown> = {}
  const regex = new RegExp(query, 'i')

  if (type === 'all' || type === 'posts') {
    results.posts = await PostModel.find({
      $or: [{ title: regex }, { content: regex }],
      published: true,
    })
      .populate('author', 'name username avatar')
      .limit(10)
      .lean()
  }

  if (type === 'all' || type === 'users') {
    results.users = await UserModel.find({
      $or: [{ name: regex }, { username: regex }],
    })
      .select('name username avatar headline')
      .limit(10)
      .lean()
  }

  if (type === 'all' || type === 'tags') {
    results.tags = await TagModel.find({
      $or: [{ name: regex }, { slug: regex }],
    })
      .limit(10)
      .lean()
  }

  return NextResponse.json(results)
}

