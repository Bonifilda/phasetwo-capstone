'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import ProtectedRoute from "@/components/auth/protectedRoute"
import { useCurrentUserFollowers, useCurrentUserFollowing } from '@/hooks'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 })
  
  // Get actual follow data
  const { data: followersData } = useCurrentUserFollowers()
  const { data: followingData } = useCurrentUserFollowing()
  
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '')
      setBio(session.user.bio || '')
      fetchUserStats()
    }
  }, [session])

  const fetchUserStats = async () => {
    if (!session?.user?.id) return
    
    try {
      // Get posts count
      const postsResponse = await fetch('/api/posts?limit=100')
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        const totalPosts = postsData.data?.length || 0
        
        setStats(prev => ({
          ...prev,
          posts: totalPosts
        }))
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }
  
  // Update stats when follow data changes
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      followers: followersData?.data?.length || 0,
      following: followingData?.data?.length || 0
    }))
  }, [followersData, followingData])

  const handleSave = async () => {
    if (!session?.user?.id) return
    
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio })
      })

      if (response.ok) {
        const updatedData = await response.json()
        setMessage('Profile updated successfully!')
        
        if (updatedData.user) {
          setName(updatedData.user.name || '')
          setBio(updatedData.user.bio || '')
        }
        
        await update()
      } else {
        const errorData = await response.json()
        setMessage(`Failed to update profile: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage('Error updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="py-6 sm:py-8 lg:py-12 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="px-4 sm:px-6 py-6 sm:py-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Your Profile</h1>

              {message && (
                <div className={`mb-4 p-3 rounded text-sm sm:text-base ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <Link href="/profile/followers" className="text-center hover:bg-gray-100 p-2 rounded transition-colors">
                    <div className="text-xl font-bold text-gray-900">{stats.followers}</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </Link>
                  <Link href="/profile/following" className="text-center hover:bg-gray-100 p-2 rounded transition-colors">
                    <div className="text-xl font-bold text-gray-900">{stats.following}</div>
                    <div className="text-sm text-gray-600">Following</div>
                  </Link>
                  <div className="text-center p-2">
                    <div className="text-xl font-bold text-gray-900">{stats.posts}</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                </div>

                <div>
                  <button 
                    onClick={handleSave}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
