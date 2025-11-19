import { NextResponse } from 'next/server'

import { getCurrentSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { FollowModel } from '@/lib/models/Follow'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  const session = await getCurrentSession()
  if (!session?.user.id) {
    return NextResponse.json({ isFollowing: false })
  }

  await connectToDatabase()
  const follow = await FollowModel.exists({
    follower: session.user.id,
    following: params.id,
  })

  return NextResponse.json({ isFollowing: Boolean(follow) })
}

