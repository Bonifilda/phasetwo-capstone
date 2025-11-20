'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface FollowButtonProps {
  userId: string
  isFollowing?: boolean
  onFollowChange?: (isFollowing: boolean) => void
  className?: string
}

export function FollowButton({ 
  userId, 
  isFollowing = false, 
  onFollowChange,
  className = ''
}: FollowButtonProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [following, setFollowing] = useState(isFollowing)

  const handleToggleFollow = async () => {
    if (!session?.user?.id || loading) return

    setLoading(true)
    try {
      const response = await fetch(`/api/users/${userId}/toggle-follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const newFollowingState = !following
        setFollowing(newFollowingState)
        onFollowChange?.(newFollowingState)
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user?.id || session.user.id === userId) {
    return null
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
        following
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-green-600 text-white hover:bg-green-700'
      } ${className}`}
    >
      {loading ? 'Loading...' : following ? 'Following' : 'Follow'}
    </button>
  )
}