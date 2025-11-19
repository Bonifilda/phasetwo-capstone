import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { FollowModel } from '@/lib/models/Follow'

const followSchema = z.object({
  userId: z.string(),
})

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const body = await request.json()
    const { userId } = followSchema.parse(body)

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'You cannot follow yourself' }, { status: 400 })
    }

    await connectToDatabase()
    await FollowModel.create({ follower: session.user.id, following: userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[FOLLOW_CREATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireSession()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    await connectToDatabase()
    await FollowModel.findOneAndDelete({ follower: session.user.id, following: userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[FOLLOW_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
  }
}

