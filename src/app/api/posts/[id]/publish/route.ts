import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSession } from '@/lib/auth/session'
import { togglePublishPost } from '@/lib/services/postService'

const publishSchema = z.object({
  published: z.boolean(),
})

interface Params {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params
    const session = await requireSession()
    const body = await request.json()
    const { published } = publishSchema.parse(body)

    const post = await togglePublishPost(id, session.user.id, published)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('[POST_PUBLISH_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to toggle publish state' }, { status: 500 })
  }
}

