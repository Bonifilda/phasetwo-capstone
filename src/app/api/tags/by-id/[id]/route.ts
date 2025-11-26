import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { TagModel } from '@/lib/models/Tag'
import { requireSession } from '@/lib/auth/session'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { id } = await params
  await connectToDatabase()
  const tag = await TagModel.findById(id).lean()
  if (!tag) {
    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  }

  return NextResponse.json({ tag })
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const { id } = await params
    await requireSession()
    await connectToDatabase()
    await TagModel.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[TAG_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}

