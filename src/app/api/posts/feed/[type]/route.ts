import { NextResponse } from 'next/server'

import { getFeed } from '@/lib/services/postService'
import { getCurrentSession } from '@/lib/auth/session'

interface Params {
  params: Promise<{ type: string }>
}

export async function GET(request: Request, { params }: Params) {
  const { type } = await params
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)
  const session = await getCurrentSession()

  const feed = await getFeed(type as 'latest' | 'following' | 'recommended', session?.user.id, page, limit)
  return NextResponse.json(feed)
}

