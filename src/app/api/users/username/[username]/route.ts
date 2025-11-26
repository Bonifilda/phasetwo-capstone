import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { UserModel } from '@/lib/models/User'

interface Params {
  params: Promise<{ username: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { username } = await params
  await connectToDatabase()
  const user = await UserModel.findOne({ username: username.toLowerCase() })
    .select('-password')
    .lean()

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

