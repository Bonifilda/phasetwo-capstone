import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { FollowModel } from '@/lib/models/Follow'

interface Params {
  params: Promise<{ id: string }>
}

export async function POST(_: Request, { params }: Params) {
  try {
    console.log('[FOLLOW_TOGGLE] Starting toggle follow request')
    
    const session = await requireSession()
    const { id } = await params
    
    console.log('[FOLLOW_TOGGLE] Session user ID:', session?.user?.id)
    console.log('[FOLLOW_TOGGLE] Target user ID:', id)
    
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
  } catch (error: any) {
    console.error('[FOLLOW_TOGGLE_ERROR]', {
      message: error.message,
      stack: error.stack
    })
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to toggle follow',
      details: error.message 
    }, { status: 500 })
  }
}


