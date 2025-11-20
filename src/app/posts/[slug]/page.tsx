
'use client'

import Link from 'next/link'
import { usePostBySlug } from '@/hooks/usePosts'
import { useComments, useCreateComment } from '@/hooks/useComments'
import { useLikes } from '@/hooks/useLikes'
import { useSession } from 'next-auth/react'
import { useState, use } from 'react'
import { FollowButton } from '@/components/shared/FollowButton'
import { LikeButton } from '@/components/shared/LikeButton'

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
    if (!commentText.trim()) return

    try {
      await createComment.mutateAsync({
        content: commentText.trim(),
        postId: post?.id || '',
      })
      setCommentText('')
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
                    <LikeButton postId={postId} />
                  </div>
                </header>

                {typeof post.content === 'string' && (
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                )}
              </article>

              <section className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold mb-4">Responses</h2>

                {postId && (
                  <div className="mb-6">
                    {session?.user ? (
                      <form onSubmit={handleAddComment} className="space-y-3">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="What are your thoughts?"
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={createComment.isPending}
                            className="px-4 py-2 rounded-full bg-green-600 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                          >
                            {createComment.isPending ? 'Sending...' : 'Respond'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-center py-4 border border-gray-200 rounded-md">
                        <p className="text-gray-600 mb-3">Sign in to leave a response</p>
                        <Link
                          href="/signin"
                          className="inline-block px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700"
                        >
                          Sign In
                        </Link>
                      </div>
                    )}
                  </div>
                )}

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
