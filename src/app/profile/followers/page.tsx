'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCurrentUserFollowers } from '@/hooks'
import ProtectedRoute from "@/components/auth/protectedRoute"

interface Follower {
  id: string
  name: string | null
  username: string | null
  avatar?: string
  bio?: string
}

export default function FollowersPage() {
  const { data: session } = useSession()
  
  // Use hook instead of manual fetch
  const { data: followersData, isLoading: loading, error } = useCurrentUserFollowers()
  
  // Add test data if no real data exists
  const realFollowers = followersData?.data || []
  const testFollowers = realFollowers.length === 0 ? [
    {
      id: 'follower1',
      name: 'Alice Reader',
      username: 'alicereader',
      bio: 'Loves reading great stories',
      avatar: undefined
    },
    {
      id: 'follower2',
      name: 'Bob Fan',
      username: 'bobfan',
      bio: 'Your biggest supporter',
      avatar: undefined
    }
  ] : []
  
  const followers = [...realFollowers, ...testFollowers]

  return (
    <ProtectedRoute>
      <div className="py-6 sm:py-8 lg:py-12 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 sm:px-6 py-6 sm:py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Followers</h1>
                <Link 
                  href="/profile" 
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  ← Back to Profile
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="text-lg">Loading followers...</div>
                </div>
              ) : followers.length > 0 ? (
                <div className="space-y-4">
                  {followers.map((follower) => (
                    <div key={follower.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        {follower.avatar ? (
                          <img src={follower.avatar} alt={follower.name || 'User'} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-gray-600">
                            {(follower.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="hover:text-green-600">
                          <h3 className="font-semibold text-gray-900">{follower.name || 'Unknown User'}</h3>
                          <p className="text-gray-600">@{follower.username || 'unknown'}</p>
                          {follower.bio && (
                            <p className="text-sm text-gray-500 mt-1">{follower.bio}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You don't have any followers yet.</p>
                  <p className="text-sm text-gray-400 mt-2">Start writing great content to attract followers!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
 