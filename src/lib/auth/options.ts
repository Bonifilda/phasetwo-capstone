import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'

import { connectToDatabase } from '@/lib/db'
import { UserModel } from '@/lib/models/User'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        await connectToDatabase()
        const user = await UserModel.findOne({ email: credentials.email }).select('+password')
        if (!user || !user.password) {
          return null
        }

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.avatar ?? undefined,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username ?? undefined
        token.userId = user.id
        
        // Update lastLogin and loginCount on successful credentials sign-in
        try {
          await connectToDatabase()
          await UserModel.findByIdAndUpdate(user.id, {
            $set: { lastLogin: new Date() },
            $inc: { loginCount: 1 },
          }, { new: true })
        } catch (e) {
          // Don't block auth on analytics update
          console.error('[NEXTAUTH_LOGIN_UPDATE_ERROR]', e)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string
        session.user.username = (token.username as string | undefined) ?? null
        
        // Fetch fresh user data from database
        try {
          await connectToDatabase()
          const user = await UserModel.findById(token.userId).select('name bio').lean()
          if (user) {
            session.user.name = user.name
            session.user.bio = user.bio
          }
        } catch (e) {
          console.error('[SESSION_UPDATE_ERROR]', e)
        }
      }
      return session
    },
  },
}

