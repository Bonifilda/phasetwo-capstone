import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'
import { getPost, updatePost, deletePost } from '@/lib/services/postService'

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(20).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
})

interface Params {
  params: {
    id: string
  }
}

export async function GET(_: Request, { params }: Params) {
  const post = await getPost(params.id)

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ post })
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await requireSession()
    const data = await request.json()
    const payload = updateSchema.parse(data)
    const post = await updatePost(params.id, payload, session.user.id)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('[POST_UPDATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const session = await requireSession()
    await deletePost(params.id, session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}

