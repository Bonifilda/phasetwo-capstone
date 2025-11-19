import { NextResponse } from 'next/server'
import { z } from 'zod'

import { listPosts, createPost } from '@/lib/services/postService'
import { requireSession } from '@/lib/auth/session'

const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(20),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 1)
  const limit = Number(searchParams.get('limit') || 10)
  const authorId = searchParams.get('authorId') || undefined
  const publishedParam = searchParams.get('published')
  const tag = searchParams.get('tag') || undefined
  const search = searchParams.get('search') || undefined

  const published =
    publishedParam === null ? undefined : publishedParam === 'true' ? true : false

  const result = await listPosts(
    {
      authorId,
      published,
      tag,
      search,
    },
    page,
    limit
  )

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  try {
    const session = await requireSession()
    const data = await request.json()
    const payload = createPostSchema.parse(data)
    const post = await createPost(payload, session.user.id)
    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('[POST_CREATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

