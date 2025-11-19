import { NextResponse } from 'next/server'
import { z } from 'zod'

import { connectToDatabase } from '@/lib/db'
import { CommentModel } from '@/lib/models/Comment'
import { PostModel } from '@/lib/models/Post'
import { requireSession } from '@/lib/auth/session'

const createSchema = z.object({
  content: z.string().min(3),
  postId: z.string(),
  parentId: z.string().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get('postId')
  const parentId = searchParams.get('parentId') || undefined
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)

  if (!postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
  }

  await connectToDatabase()

  const filter = {
    post: postId,
    parent: parentId ?? null,
  }

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    CommentModel.find(filter)
      .populate('author', 'name username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CommentModel.countDocuments(filter),
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

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const body = await request.json()
    const data = createSchema.parse(body)

    await connectToDatabase()

    const comment = await CommentModel.create({
      content: data.content,
      post: data.postId,
      parent: data.parentId ?? null,
      author: session.user.id,
    })

    await PostModel.findByIdAndUpdate(data.postId, { $inc: { commentsCount: 1 } })

    const populated = await comment.populate('author', 'name username avatar')

    return NextResponse.json({ comment: populated }, { status: 201 })
  } catch (error) {
    console.error('[COMMENT_CREATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}

