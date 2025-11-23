import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { FollowModel } from '@/lib/models/Follow'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(_: Request, { params }: Params) {
  try {
    const session = await requireSession()
    const { id } = await params
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    if (session.user.id === id) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })
    }

    await connectToDatabase()
    const existing = await FollowModel.findOne({
      follower: session.user.id,
      following: id,
    })

    if (existing) {
      await existing.deleteOne()
      return NextResponse.json({ isFollowing: false })
    }

    await FollowModel.create({ follower: session.user.id, following: id })
    return NextResponse.json({ isFollowing: true })
  } catch (error) {
    console.error('[FOLLOW_TOGGLE_ERROR]', {
      error: error.message,
      stack: error.stack
    })
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 })
  }
}

