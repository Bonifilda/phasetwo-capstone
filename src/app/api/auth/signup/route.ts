import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hash } from 'bcryptjs'
import slugify from 'slugify'

import { connectToDatabase } from '../../../../lib/db'
import { UserModel } from '../../../../lib/models/User'

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = signUpSchema.parse(body)

    await connectToDatabase()

    const existingUser = await UserModel.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    const baseUsername = slugify(name, { lower: true, strict: true })
    const usernameCandidate = baseUsername || email.split('@')[0]

    let username = usernameCandidate
    let counter = 1
    while (await UserModel.exists({ username })) {
      username = `${usernameCandidate}-${counter}`
      counter += 1
    }

    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      username,
    })

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          username: user.username,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[SIGN_UP_ERROR]', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  }
}

