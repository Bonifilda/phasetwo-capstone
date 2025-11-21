'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface PostInteractionsProps {
  post: {
    id?: string
    slug?: string
    likesCount?: number
    commentsCount?: number
  }
}

export function PostInteractions({ post }: PostInteractionsProps) {
  const { data: session } = useSession()
  const [isLiking, setIsLiking] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likesCount || 0)
  const router = useRouter()
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!session?.user?.id) {
      router.push('/signin')
      return
    }
    
    if (!post.id || isLiking) return
    
    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/toggle-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (response.ok) {
        const data = await response.json()
        setLikeCount(data.likesCount)
      } else {
        console.error('Failed to like post')
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <button
        onClick={handleLike}
        disabled={isLiking}
        className="flex items-center gap-1 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        👏 {likeCount}
      </button>
      
      <Link
        href={`/posts/${post.slug || post.id || '#'}#comments`}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        💬 {post.commentsCount || 0}
      </Link>
    </div>
  )
}