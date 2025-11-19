import { NextResponse } from 'next/server'

import { listPosts } from '@/lib/services/postService'

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params }: Params) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)
  const publishedParam = searchParams.get('published')

  const published =
    publishedParam === null ? undefined : publishedParam === 'true' ? true : false

  const posts = await listPosts(
    {
      authorId: params.id,
      published,
    },
    page,
    limit
  )

  return NextResponse.json(posts)
}

