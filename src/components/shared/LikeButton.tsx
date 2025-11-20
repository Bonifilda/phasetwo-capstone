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
    if (!session?.user?.id) {
      router.push('/signin')
      return
    }
    
    if (!postId || isLiking) return
    
    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        setLikeCount(prev => prev + 1)
        setIsLiked(true)
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
      className="inline-flex items-center gap-1 text-sm text-gray-700 hover:text-green-600 disabled:opacity-60 transition-colors"
    >
      <span>{isLiked ? '👏 Liked' : '👏 Clap'}</span>
      <span className="text-gray-500">{likeCount}</span>
    </button>
  )
}