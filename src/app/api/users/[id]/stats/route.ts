import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { PostModel } from '@/lib/models/Post'
import { FollowModel } from '@/lib/models/Follow'
import { LikeModel } from '@/lib/models/Like'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  await connectToDatabase()

  const [postsCount, draftsCount, followersCount, followingCount, totalLikes] = await Promise.all([
    PostModel.countDocuments({ author: id, published: true }),
    PostModel.countDocuments({ author: id, published: false }),
    FollowModel.countDocuments({ following: id }),
    FollowModel.countDocuments({ follower: id }),
    LikeModel.countDocuments({ post: { $in: await PostModel.find({ author: id }).distinct('_id') } }),
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

