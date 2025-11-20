
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
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your stories and profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Stories</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{published}</p>
              <p className="text-gray-600">Published stories</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Drafts</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">{drafts}</p>
              <p className="text-gray-600">Unpublished stories</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Readers</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600">Total readers</p>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/create"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Write a Story
              </Link>
              <Link
                href="/profile"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                href="/posts"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
