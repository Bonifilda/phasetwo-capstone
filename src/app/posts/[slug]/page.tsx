
'use client'

import Link from 'next/link'
import { usePostBySlug } from '@/hooks/usePosts'
import { useSession } from 'next-auth/react'
import { useState, use } from 'react'
import { FollowButton } from '@/components/shared/FollowButton'
import { SimpleLikeButton } from '@/components/shared/SimpleLikeButton'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = use(params)
  const { data: post, isLoading, isError } = usePostBySlug(slug)
  const { data: session } = useSession()
  
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentSuccess, setCommentSuccess] = useState('')

  const postId = post?.id

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !postId || isSubmitting) return

    setIsSubmitting(true)
    setCommentSuccess('')

    try {
      const response = await fetch(`/api/posts/${postId}/add-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setCommentText('')
        setCommentSuccess('Comment added successfully! 🎉')
        // Update comment count in UI
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        const errorData = await response.json()
        setCommentSuccess(`Error: ${errorData.error}`)
      }
    } catch (error) {
      setCommentSuccess('Failed to add comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="py-8 sm:py-12 lg:py-16 bg-white min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/posts"
            className="inline-flex items-center text-sm sm:text-base text-gray-600 hover:text-gray-900 mb-6 sm:mb-8"
          >
            ← Back to Stories
          </Link>

          {isLoading && <div className="text-gray-600">Loading post...</div>}

          {isError && (
            <div className="text-red-600">Failed to load post. Please try again later.</div>
          )}

          {!isLoading && !isError && post && (
            <>
              <article>
                <header className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-3 sm:mb-4">
                    {post.title}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900 text-sm sm:text-base">{post.author?.name ?? 'Unknown author'}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {post.author?.id && (
                      <FollowButton userId={post.author.id} />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600 text-xs sm:text-sm">
                    {post.readTime && (
                      <>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </>
                    )}
                    <span>•</span>
                    {postId && <SimpleLikeButton postId={postId} initialCount={post._count?.likes || 0} />}
                  </div>
                </header>

                {typeof post.content === 'string' && (
                  <div
                    className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-black"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}
              </article>

              {/* Like Section */}
              <div className="mt-6 sm:mt-8 py-4 sm:py-6 border-y border-gray-200 bg-gray-50">
                <div className="text-center space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-black">Like this story</h3>
                  {postId && (
                    <SimpleLikeButton postId={postId} initialCount={post._count?.likes || 0} />
                  )}
                </div>
              </div>

              <section className="mt-6 sm:mt-8 pt-6 sm:pt-8">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-black">Comments</h2>

                <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
                  {session?.user ? (
                    <form onSubmit={handleAddComment} className="space-y-3 sm:space-y-4">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="What are your thoughts?"
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                      />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Signed in as {session.user.name}
                        </span>
                        <button
                          type="submit"
                          disabled={isSubmitting || !commentText.trim()}
                          className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-full bg-green-600 text-white text-sm sm:text-base font-medium hover:bg-green-700 disabled:opacity-60"
                        >
                          {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                      {commentSuccess && (
                        <div className={`mt-3 p-3 rounded-md text-xs sm:text-sm ${
                          commentSuccess.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {commentSuccess}
                        </div>
                      )}
                    </form>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Sign in to leave a comment</p>
                      <Link
                        href="/signin"
                        className="inline-block w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-full text-sm sm:text-base font-medium hover:bg-green-700 text-center"
                      >
                        Sign In to Comment
                      </Link>
                    </div>
                  )}
                </div>

                <p className="text-gray-500 text-xs sm:text-sm">Comments will be loaded here.</p>
              </section>
            </>
          )}
        </div>
      </div>
  )
}
