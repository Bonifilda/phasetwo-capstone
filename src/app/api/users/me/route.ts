import { NextResponse } from 'next/server'
import { z } from 'zod'

import { requireSession } from '@/lib/auth/session'
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

export async function GET() {
  const session = await requireSession()
  await connectToDatabase()
  const user = await UserModel.findById(session.user.id).select('-password').lean()
  return NextResponse.json({ user })
}

export async function PUT(request: Request) {
  try {
    const session = await requireSession()
    const body = await request.json()
    const data = updateSchema.parse(body)

    await connectToDatabase()
    const user = await UserModel.findByIdAndUpdate(session.user.id, data, { new: true }).select(
      '-password'
    )

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[CURRENT_USER_UPDATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

