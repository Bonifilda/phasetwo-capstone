import { NextResponse } from 'next/server'
import { z } from 'zod'
import { connectToDatabase } from '@/lib/db'
import { UserModel } from '@/lib/models/User'
import { requireSession } from '@/lib/auth/session'

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  username: z.string().optional(),
  headline: z.string().optional(),
  website: z.string().url().optional(),
  social: z.object({
    twitter: z.string().optional(),
    github: z.string().optional(),
    linkedin: z.string().optional(),
  }).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase()
    
    const user = await UserModel.findById(params.id).select('-password')
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('[USER_GET_ERROR]', error)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireSession()
    
    // Users can only update their own profile
    if (session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const data = await request.json()
    const payload = updateUserSchema.parse(data)

    await connectToDatabase()
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      params.id,
      payload,
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('[USER_UPDATE_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues.map(i => i.message).join(', ') }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}