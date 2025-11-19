import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { UserModel } from '@/lib/models/User'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number(searchParams.get('limit') || 5)

  await connectToDatabase()
  const users = await UserModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name username avatar headline bio')
    .lean()

  return NextResponse.json({ users })
}

