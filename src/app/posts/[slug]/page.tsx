
'use client'

import Link from 'next/link'
import { usePostBySlug } from '@/hooks/usePosts'
import { useComments, useCreateComment } from '@/hooks/useComments'
import { useLikes } from '@/hooks/useLikes'
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
  const postId = post?.id
  const commentsHook = postId ? useComments({ postId, page: 1, limit: 50 }) : undefined
  const likesHook = postId ? useLikes(postId) : undefined
  const commentsData = commentsHook?.data
  const likesData = likesHook?.data
  const toggleLike = likesHook?.toggleLike as any
  const isLiking = likesHook?.isLiking as boolean | undefined
  const { data: session } = useSession()

  const [commentText, setCommentText] = useState('')
  const createComment = useCreateComment()

  const comments = commentsData?.data ?? []
  const likesCount = likesData?.likesCount ?? 0
  const isLiked = likesData?.isLiked ?? false

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !postId) return

    try {
      const response = await fetch(`/api/posts/${postId}/add-comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setCommentText('')
        // Refresh the page to show updated comment count
        window.location.reload()
      } else {
        const errorData = await response.json()
        console.error('Failed to add comment:', errorData.error)
      }
    } catch (error) {
      console.error('Failed to add comment', error)
    }
  }

  return (
      <div className="py-16 bg-white min-h-screen">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/posts"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
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
                <header className="mb-8">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                    {post.title}
                  </h1>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900">{post.author?.name ?? 'Unknown author'}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {post.author?.id && (
                      <FollowButton userId={post.author.id} />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
                    {post.readTime && (
                      <>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </>
                    )}
                    <span>•</span>
                    {postId && <SimpleLikeButton postId={postId} initialCount={post.likesCount || 0} />}
                  </div>
                </header>

                {typeof post.content === 'string' && (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}
              </article>

              {/* Like Section */}
              <div className="mt-8 py-6 border-y border-gray-200 bg-gray-50">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold">Like this story</h3>
                  {postId ? (
                    <SimpleLikeButton postId={postId} initialCount={post.likesCount || 0} />
                  ) : (
                    <div className="text-red-500">No Post ID</div>
                  )}
                  <div className="text-sm text-gray-600">
                    Session: {session?.user?.name || 'Not signed in'}
                  </div>
                </div>
              </div>

              <section className="mt-8 pt-8">
                <h2 className="text-xl font-semibold mb-6">Comments ({comments.length})</h2>

                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  {session?.user ? (
                    <form onSubmit={handleAddComment} className="space-y-4">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="What are your thoughts?"
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Signed in as {session.user.name}
                        </span>
                        <button
                          type="submit"
                          disabled={createComment.isPending || !commentText.trim()}
                          className="px-6 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-60"
                        >
                          {createComment.isPending ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Sign in to leave a comment</p>
                      <Link
                        href="/signin"
                        className="inline-block px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700"
                      >
                        Sign In to Comment
                      </Link>
                    </div>
                  )}
                </div>

                {comments.length === 0 && (
                  <p className="text-gray-500 text-sm">No responses yet. Be the first to comment.</p>
                )}

                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.id} className="border-b border-gray-100 pb-4">
                      <div className="text-sm text-gray-700 mb-1">
                        {comment.author?.name ?? 'Anonymous'}
                      </div>
                      <p className="text-gray-800 text-sm whitespace-pre-wrap">{comment.content}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
  )
}
