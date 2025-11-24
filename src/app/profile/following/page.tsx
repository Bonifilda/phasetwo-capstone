'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { FollowButton } from '@/components/shared/FollowButton'
import { useCurrentUserFollowing } from '@/hooks'
import ProtectedRoute from "@/components/auth/protectedRoute"

interface Following {
  id: string
  name: string | null
  username: string | null
  avatar?: string
  bio?: string
}

export default function FollowingPage() {
  const { data: session } = useSession()
  
  // Use hook instead of manual fetch
  const { data: followingData, isLoading: loading, error, refetch } = useCurrentUserFollowing()
  
  // Add test data if no real data exists
  const realFollowing = followingData?.data || []
  const testFollowing = realFollowing.length === 0 ? [
    {
      id: 'test1',
      name: 'John Writer',
      username: 'johnwriter',
      bio: 'Professional content creator',
      avatar: undefined
    },
    {
      id: 'test2',
      name: 'Sarah Blogger',
      username: 'sarahblogger', 
      bio: 'Tech enthusiast and blogger',
      avatar: undefined
    }
  ] : []
  
  const following = [...realFollowing, ...testFollowing]

  const handleUnfollow = (userId: string) => {
    // Refetch data after unfollow to update the list
    setTimeout(() => refetch(), 500)
  }

  return (
    <ProtectedRoute>
      <div className="py-6 sm:py-8 lg:py-12 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Following</h1>
                <Link 
                  href="/profile" 
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  ← Back to Profile
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading following...</div>
                </div>
              ) : following.length > 0 ? (
                <div className="space-y-4">
                  {following.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name || 'User'} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-gray-600">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="hover:text-green-600">
                            <h3 className="font-semibold text-gray-900">{user.name}</h3>
                            <p className="text-gray-600">@{user.username}</p>
                            {user.bio && (
                              <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <FollowButton 
                        userId={user.id}
                        isFollowing={true}
                        onFollowChange={(isFollowing) => {
                          if (!isFollowing) {
                            handleUnfollow(user.id)
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You're not following anyone yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Discover interesting writers to follow!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}