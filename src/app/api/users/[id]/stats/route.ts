import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'
import { FollowModel } from '@/lib/models/Follow'
import { LikeModel } from '@/lib/models/Like'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()

  const [postsCount, draftsCount, followersCount, followingCount, totalLikes] = await Promise.all([
    PostModel.countDocuments({ author: params.id, published: true }),
    PostModel.countDocuments({ author: params.id, published: false }),
    FollowModel.countDocuments({ following: params.id }),
    FollowModel.countDocuments({ follower: params.id }),
    LikeModel.countDocuments({ post: { $in: await PostModel.find({ author: params.id }).distinct('_id') } }),
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

