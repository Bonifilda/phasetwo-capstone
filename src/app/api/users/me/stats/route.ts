import { NextResponse } from 'next/server'

import { requireSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'
import { FollowModel } from '@/lib/models/Follow'
import { LikeModel } from '@/lib/models/Like'

export async function GET() {
  const session = await requireSession()
  await connectToDatabase()

  const postIds = await PostModel.find({ author: session.user.id }).distinct('_id')

  const [postsCount, draftsCount, followersCount, followingCount, totalLikes] = await Promise.all([
    PostModel.countDocuments({ author: session.user.id, published: true }),
    PostModel.countDocuments({ author: session.user.id, published: false }),
    FollowModel.countDocuments({ following: session.user.id }),
    FollowModel.countDocuments({ follower: session.user.id }),
    LikeModel.countDocuments({ post: { $in: postIds } }),
  ])

  return NextResponse.json({
    postsCount,
    draftsCount,
    followersCount,
    followingCount,
    totalLikes,
    totalViews: 0,
  })
}

