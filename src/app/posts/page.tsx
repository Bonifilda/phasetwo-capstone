'use client'

import Link from 'next/link'
import { usePosts } from '@/hooks/usePosts'
import { FollowButton } from '@/components/shared/FollowButton'
import { PostInteractions } from '@/components/shared/PostInteractions'
import { useSession } from 'next-auth/react'

export default function PostsPage() {
  const { data, isLoading, isError } = usePosts({ page: 1, limit: 20, published: true })
  const { data: session } = useSession()

  const posts = data?.data ?? []

  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Latest Stories
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-gray-600 max-w-xl lg:max-w-2xl mx-auto px-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {posts.map((post, index) => {
              // Create a unique key, using index as fallback if id is undefined
              const uniqueKey = post.id ? `post-${post.id}` : `post-index-${index}`;
              
              return (
                <div
                  key={uniqueKey}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
                      {post.title || 'Untitled Post'}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 mb-3 gap-1 sm:gap-0">
                      <span className="truncate">{post.author?.name || 'Unknown author'}</span>
                      {post.readTime && <span className="flex">{post.readTime} min read</span>}
                    </div>
                    {post.author?.id && (
                      <div className="mb-3">
                        <FollowButton userId={post.author.id} className="text-xs px-2 sm:px-3 py-1" />
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-4 gap-2 sm:gap-0">
                      <PostInteractions post={post} />
                      <Link
                        href={`/posts/${post.slug || post.id || '#'}`}
                        className="text-green-600 hover:text-green-700 font-medium text-sm text-center sm:text-left"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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