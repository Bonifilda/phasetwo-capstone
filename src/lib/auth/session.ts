import { getServerSession } from 'next-auth'
import { authOptions } from './options'

export async function getCurrentSession() {
  return getServerSession(authOptions)
}

export async function requireSession() {
  const session = await getCurrentSession()
  console.log('Session check:', { hasSession: !!session, hasUser: !!session?.user, hasId: !!session?.user?.id })
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

