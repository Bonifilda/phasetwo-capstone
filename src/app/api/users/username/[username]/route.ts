import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { UserModel } from '@/lib/models/User'

interface Params {
  params: { username: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const user = await UserModel.findOne({ username: params.username.toLowerCase() })
    .select('-password')
    .lean()

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}

