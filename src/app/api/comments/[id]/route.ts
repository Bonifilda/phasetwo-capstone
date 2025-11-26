import { NextResponse } from 'next/server'
import { z } from 'zod'

import { connectToDatabase } from '@/lib/db'
import { CommentModel } from '@/lib/models/Comment'
import { PostModel } from '@/lib/models/Post'
import { requireSession } from '@/lib/auth/session'

const updateSchema = z.object({
  content: z.string().min(3),
})

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  await connectToDatabase()
  const comment = await CommentModel.findById(id)
    .populate('author', 'name username avatar')
    .lean()

  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
  }

  return NextResponse.json({ comment })
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const session = await requireSession()
    const body = await request.json()
    const data = updateSchema.parse(body)

    await connectToDatabase()
    const comment = await CommentModel.findOneAndUpdate(
      { _id: id, author: session.user.id },
      { content: data.content },
      { new: true }
    ).populate('author', 'name username avatar')

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('[COMMENT_UPDATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params
    const session = await requireSession()

    await connectToDatabase()
    const comment = await CommentModel.findOneAndDelete({
      _id: id,
      author: session.user.id,
    })

    if (comment) {
      await PostModel.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[COMMENT_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}

