import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'
import { requireSession } from '@/lib/auth/session'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession()
    const { id } = await params
    await connectToDatabase()

    // Simply increment the like count
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { $inc: { likesCount: 1 } },
      { new: true }
    )

    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      likesCount: updatedPost.likesCount 
    })
  } catch (error) {
    console.error('[SIMPLE_LIKE_ERROR]', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}