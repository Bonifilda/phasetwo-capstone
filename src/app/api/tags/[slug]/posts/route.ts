import { NextResponse } from 'next/server'

import { listPosts } from '@/lib/services/postService'

interface Params {
  params: { slug: string }
}

export async function GET(request: Request, { params }: Params) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)

  const posts = await listPosts(
    {
      tag: params.slug,
      published: true,
    },
    page,
    limit
  )

  return NextResponse.json(posts)
}

