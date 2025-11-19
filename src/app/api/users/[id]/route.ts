import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSession, getCurrentSession } from '@/lib/auth/session'
import { connectToDatabase } from '@/lib/db'
import { UserModel } from '@/lib/models/User'

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  headline: z.string().max(120).optional(),
  avatar: z.string().url().optional(),
  website: z.string().url().optional(),
  social: z
    .object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .partial()
    .optional(),
})

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const user = await UserModel.findById(params.id)
    .select('-password')
    .lean()

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await requireSession()
    if (session.user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const data = updateSchema.parse(body)

    await connectToDatabase()
    const user = await UserModel.findByIdAndUpdate(params.id, data, { new: true }).select(
      '-password'
    )

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[USER_UPDATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const session = await requireSession()
    if (session.user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectToDatabase()
    await UserModel.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[USER_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}

