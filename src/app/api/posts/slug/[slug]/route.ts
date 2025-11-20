import { NextResponse } from 'next/server'
import { getPost } from '@/lib/services/postService'

interface Params {
  params: Promise<{ slug: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ post })
}

