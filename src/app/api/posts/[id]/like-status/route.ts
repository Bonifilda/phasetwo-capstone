import { NextResponse } from 'next/server'

import { getCurrentSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { LikeModel } from '@/lib/models/Like'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  const session = await getCurrentSession()
  if (!session?.user.id) {
    return NextResponse.json({ isLiked: false })
  }

  await connectToDatabase()
  const like = await LikeModel.exists({ post: id, user: session.user.id })
  return NextResponse.json({ isLiked: Boolean(like) })
}

