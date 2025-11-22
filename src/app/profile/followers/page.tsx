'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCurrentUserFollowers } from '@/hooks'
import ProtectedRoute from "@/components/auth/protectedRoute"

interface Follower {
  _id: string
  name: string
  username: string
  avatar?: string
  bio?: string
}

export default function FollowersPage() {
  const { data: session } = useSession()
  
  // Use hook instead of manual fetch
  const { data: followersData, isLoading: loading, error } = useCurrentUserFollowers()
  
  const followers = followersData?.data || []

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
                    <div key={follower._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        {follower.avatar ? (
                          <img src={follower.avatar} alt={follower.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-gray-600">
                            {follower.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <Link href={`/users/${follower.username}`} className="hover:text-green-600">
                          <h3 className="font-semibold text-gray-900">{follower.name}</h3>
                          <p className="text-gray-600">@{follower.username}</p>
                          {follower.bio && (
                            <p className="text-sm text-gray-500 mt-1">{follower.bio}</p>
                          )}
                        </Link>
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