'use client'

import { useSession } from 'next-auth/react'
import { useToggleFollow, useFollowStatus } from '@/hooks'

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
  
  // Use hooks for follow functionality
  const { data: followStatus } = useFollowStatus(userId)
  const toggleFollow = useToggleFollow()
  
  // Use hook data if available, otherwise use prop
  const isCurrentlyFollowing = followStatus ?? isFollowing

  const handleToggleFollow = async () => {
    if (!session?.user?.id || toggleFollow.isPending) return

    try {
      await toggleFollow.mutateAsync(userId)
      onFollowChange?.(!isCurrentlyFollowing)
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  if (!session?.user?.id || session.user.id === userId) {
    return null
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={toggleFollow.isPending}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 ${
        isCurrentlyFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-green-600 text-white hover:bg-green-700'
      } ${className}`}
    >
      {toggleFollow.isPending ? 'Loading...' : isCurrentlyFollowing ? 'Following' : 'Follow'}
    </button>
  )
}