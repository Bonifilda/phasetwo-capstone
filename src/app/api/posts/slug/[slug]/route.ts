import { NextResponse } from 'next/server'
import { getPost } from '@/lib/services/postService'

interface Params {
  params: { slug: string }
}

export async function GET(_: Request, { params }: Params) {
  const post = await getPost(params.slug)
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ post })
}

