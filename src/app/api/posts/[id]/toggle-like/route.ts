import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { LikeModel } from '@/lib/models/Like'
import { PostModel } from '@/lib/models/Post'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(_: Request, { params }: Params) {
  try {
    const session = await requireSession()
    const { id } = await params
    await connectToDatabase()

    const existing = await LikeModel.findOne({
      user: session.user.id,
      post: id,
    })

    let updatedPost
    if (existing) {
      await existing.deleteOne()
      updatedPost = await PostModel.findByIdAndUpdate(id, { $inc: { likesCount: -1 } }, { new: true })
      return NextResponse.json({ isLiked: false, likesCount: updatedPost?.likesCount || 0 })
    }

    await LikeModel.create({ user: session.user.id, post: id })
    updatedPost = await PostModel.findByIdAndUpdate(id, { $inc: { likesCount: 1 } }, { new: true })
    return NextResponse.json({ isLiked: true, likesCount: updatedPost?.likesCount || 0 })
  } catch (error) {
    console.error('[LIKE_TOGGLE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}

