import { NextResponse } from 'next/server'

import { getCurrentSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { FollowModel } from '@/lib/models/Follow'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  const session = await getCurrentSession()
  if (!session?.user.id) {
    return NextResponse.json({ isFollowing: false })
  }

  await connectToDatabase()
  const follow = await FollowModel.exists({
    follower: session.user.id,
    following: id,
  })

  return NextResponse.json({ isFollowing: Boolean(follow) })
}

