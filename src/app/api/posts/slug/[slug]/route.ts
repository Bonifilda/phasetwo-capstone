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

  // Transform _id to id for frontend compatibility
  const transformedPost = {
    ...post,
    id: post._id.toString(),
    author: post.author ? {
      ...post.author,
      id: (post.author as any)._id?.toString() || (post.author as any).id
    } : null
  }

  return NextResponse.json({ post: transformedPost })
}

