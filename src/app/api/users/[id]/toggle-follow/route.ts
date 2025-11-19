import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { FollowModel } from '@/lib/models/Follow'

interface Params {
  params: { id: string }
}

export async function POST(_: Request, { params }: Params) {
  try {
    const session = await requireSession()
    if (session.user.id === params.id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    await connectToDatabase()
    const existing = await FollowModel.findOne({
      follower: session.user.id,
      following: params.id,
    })

    if (existing) {
      await existing.deleteOne()
      return NextResponse.json({ isFollowing: false })
    }

    await FollowModel.create({ follower: session.user.id, following: params.id })
    return NextResponse.json({ isFollowing: true })
  } catch (error) {
    console.error('[FOLLOW_TOGGLE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 })
  }
}

