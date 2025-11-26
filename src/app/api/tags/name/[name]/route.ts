import { NextResponse } from 'next/server'

import { connectToDatabase } from '@/lib/db'
import { TagModel } from '@/lib/models/Tag'
import { generateSlug } from '@/lib/utils'

interface Params {
  params: Promise<{ name: string }>
}

export async function GET(_: Request, { params }: Params) {
  const { name } = await params
  await connectToDatabase()
  const tag = await TagModel.findOne({ slug: generateSlug(name) }).lean()
  if (!tag) {
    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  }

  return NextResponse.json({ tag })
}

