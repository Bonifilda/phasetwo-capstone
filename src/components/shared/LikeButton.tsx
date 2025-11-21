'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  postId?: string
}

export function LikeButton({ postId }: LikeButtonProps) {
  const { data: session } = useSession()
  const [isLiking, setIsLiking] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (postId) {
      // Fetch current like status
      fetchLikeStatus()
    }
  }, [postId])

  const fetchLikeStatus = async () => {
    if (!postId) return
    
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setLikeCount(data.post?.likesCount || 0)
      }
    } catch (error) {
      console.error('Failed to fetch like status:', error)
    }
  }

  const handleLike = async () => {
    console.log('Like button clicked', { postId, sessionUserId: session?.user?.id })
    
    if (!session?.user?.id) {
      router.push('/signin')
      return
    }
    
    if (!postId || isLiking) return
    
    setIsLiking(true)
    try {
      console.log('Making API call to:', `/api/posts/${postId}/toggle-like`)
      const response = await fetch(`/api/posts/${postId}/toggle-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      console.log('API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('API response data:', data)
        setLikeCount(data.likesCount)
        setIsLiked(data.isLiked)
      } else {
        const errorData = await response.json()
        console.error('API error:', errorData)
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  if (!postId) return null

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className="flex flex-col items-center gap-2 px-6 py-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 disabled:opacity-60 transition-all duration-200 min-w-[100px]"
    >
      <span className="text-2xl">👏</span>
      <span className="text-sm font-medium text-gray-700">
        {isLiking ? 'Loading...' : likeCount}
      </span>
      <span className="text-xs text-gray-500">
        {isLiked ? 'Liked' : 'Clap'}
      </span>
    </button>
  )
}