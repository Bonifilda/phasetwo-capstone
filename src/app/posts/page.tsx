
'use client'

import Link from 'next/link'
import { usePosts } from '@/hooks/usePosts'

export default function PostsPage() {
  const { data, isLoading, isError } = usePosts({ page: 1, limit: 20, published: true })

  const posts = data?.data ?? []

  return (
      <div className="py-16 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Latest Stories
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Discover amazing stories from our community of writers.
            </p>
          </div>

          {isLoading && (
            <div className="text-center text-gray-600 py-12">Loading stories...</div>
          )}

          {isError && (
            <div className="text-center text-red-600 py-12">
              Failed to load stories. Please try again later.
            </div>
          )}

          {!isLoading && !isError && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author?.name ?? 'Unknown author'}</span>
                      {post.readTime && <span>{post.readTime} min read</span>}
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/posts/${post.id}`}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && !isError && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share your story!</p>
              <Link
                href="/signup"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
  )
}
