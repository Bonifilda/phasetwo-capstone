import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { LikeModel } from '@/lib/models/Like'
import { PostModel } from '@/lib/models/Post'

const likeSchema = z.object({
  postId: z.string(),
})

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const body = await request.json()
    const { postId } = likeSchema.parse(body)

    await connectToDatabase()

    await LikeModel.create({ user: session.user.id, post: postId })
    await PostModel.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[LIKE_CREATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireSession()
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
    }

    await connectToDatabase()
    const like = await LikeModel.findOneAndDelete({ post: postId, user: session.user.id })
    if (like) {
      await PostModel.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[LIKE_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to unlike post' }, { status: 500 })
  }
}

