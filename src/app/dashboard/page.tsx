
'use client'

import ProtectedRoute from '@/components/auth/protectedRoute'
import Link from 'next/link'
import { usePosts } from '@/hooks/usePosts'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session } = useSession()

  const { data: postsData, isLoading } = usePosts({
    authorId: session?.user?.id
  })

  if (isLoading) {
    return <p className="p-10">Loading...</p>
  }

  const posts = postsData?.data || []
  const published = posts.filter(p => p.published).length
  const drafts = posts.filter(p => !p.published).length

  return (
    <ProtectedRoute>
      <div className="py-6 sm:py-8 lg:py-12 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">Manage your stories and profile</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Stories</h3>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-green-600">{published}</p>
              <p className="text-sm sm:text-base text-gray-600">Published stories</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Drafts</h3>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-yellow-600">{drafts}</p>
              <p className="text-sm sm:text-base text-gray-600">Unpublished stories</p>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Readers</h3>
              <p className="mt-2 text-2xl sm:text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm sm:text-base text-gray-600">Total readers</p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 bg-black p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Link
                href="/create"
                className="bg-green-600 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-green-700 transition-colors text-center"
              >
                Write a Story
              </Link>
              <Link
                href="/profile"
                className="bg-gray-600 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-700 transition-colors text-center"
              >
                Edit Profile
              </Link>
              <Link
                href="/posts"
                className="bg-blue-600 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition-colors text-center sm:col-span-2 lg:col-span-1"
              >
                Browse Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
