'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FollowButton } from '@/components/shared/FollowButton'

interface User {
  _id: string
  name: string
  username: string
  bio?: string
  avatar?: string
  followersCount: number
  followingCount: number
  postsCount: number
}

interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (username) {
      fetchUserData()
    }
  }, [username])

  const fetchUserData = async () => {
    try {
      const [userResponse, postsResponse] = await Promise.all([
        fetch(`/api/users/username/${username}`),
        fetch(`/api/posts?authorId=${username}&published=true`)
      ])

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      }

      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">User not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">@{user.username}</p>
                {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
              </div>
            </div>
            <FollowButton 
              userId={user._id} 
              isFollowing={isFollowing}
              onFollowChange={setIsFollowing}
            />
          </div>

          {/* Stats */}
          <div className="flex space-x-6 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-xl font-bold">{user.postsCount || 0}</div>
              <div className="text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.followersCount || 0}</div>
              <div className="text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{user.followingCount || 0}</div>
              <div className="text-gray-600">Following</div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Posts by {user.name}</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-3">
                  {post.content.substring(0, 200)}...
                </p>
                <div className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No posts yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}