import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { LikeModel } from '@/lib/models/Like'
import { PostModel } from '@/lib/models/Post'

interface Params {
  params: { id: string }
}

export async function POST(_: Request, { params }: Params) {
  try {
    const session = await requireSession()
    await connectToDatabase()

    const existing = await LikeModel.findOne({
      user: session.user.id,
      post: params.id,
    })

    if (existing) {
      await existing.deleteOne()
      await PostModel.findByIdAndUpdate(params.id, { $inc: { likesCount: -1 } })
      return NextResponse.json({ isLiked: false })
    }

    await LikeModel.create({ user: session.user.id, post: params.id })
    await PostModel.findByIdAndUpdate(params.id, { $inc: { likesCount: 1 } })
    return NextResponse.json({ isLiked: true })
  } catch (error) {
    console.error('[LIKE_TOGGLE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}

