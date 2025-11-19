import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { TagModel } from '@/lib/models/Tag'
import { requireSession } from '@/lib/auth/session'

interface Params {
  params: { id: string }
}

export async function GET(_: Request, { params }: Params) {
  await connectToDatabase()
  const tag = await TagModel.findById(params.id).lean()
  if (!tag) {
    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  }

  return NextResponse.json({ tag })
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await requireSession()
    await connectToDatabase()
    await TagModel.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[TAG_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}

