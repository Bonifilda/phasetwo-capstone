'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface SimpleLikeButtonProps {
  postId: string
  initialCount?: number
}

export function SimpleLikeButton({ postId, initialCount = 0 }: SimpleLikeButtonProps) {
  const { data: session } = useSession()
  const [count, setCount] = useState(initialCount)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    if (!session?.user?.id) {
      router.push('/signin')
      return
    }

    if (isLoading) return

    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/posts/${postId}/simple-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCount(data.likesCount)
      } else {
        console.error('Failed to like post')
      }
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors disabled:opacity-50"
    >
      <span className="text-lg">👏</span>
      <span className="font-medium text-black">{count}</span>
      {isLoading && <span className="text-sm text-black">...</span>}
    </button>
  )
}