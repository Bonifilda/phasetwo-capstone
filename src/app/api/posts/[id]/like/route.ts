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

    const post = await PostModel.findById(id)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Simple like increment (in a real app, you'd track individual likes)
    await PostModel.findByIdAndUpdate(id, {
      $inc: { likesCount: 1 }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[LIKE_POST_ERROR]', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}