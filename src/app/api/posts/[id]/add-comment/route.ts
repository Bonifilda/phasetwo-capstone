import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'
import { requireSession } from '@/lib/auth/session'

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession()
    const { id: postId } = await params
    const body = await request.json()
    const { content } = commentSchema.parse(body)

    await connectToDatabase()

    // For now, just increment the comment count
    const updatedPost = await PostModel.findByIdAndUpdate(
      postId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    )

    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Return a mock comment
    const mockComment = {
      id: Date.now().toString(),
      content,
      author: {
        name: session.user.name,
        username: session.user.name,
      },
      createdAt: new Date().toISOString(),
      postId,
    }

    return NextResponse.json({ 
      comment: mockComment,
      commentsCount: updatedPost.commentsCount 
    }, { status: 201 })
  } catch (error) {
    console.error('[ADD_COMMENT_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Please sign in to comment' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}