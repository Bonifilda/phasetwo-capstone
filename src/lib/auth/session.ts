import { getServerSession } from 'next-auth'
import { authOptions } from './options'

export async function getCurrentSession() {
  return getServerSession(authOptions)
}

export async function requireSession() {
  const session = await getCurrentSession()
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }
  return session
}

