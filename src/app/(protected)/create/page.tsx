'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { RichTextEditor } from '@/components/editor/RichTextEditor'
import { useCreatePost } from '@/hooks/usePosts'

export default function CreatePostPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const createPost = useCreatePost()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)
  const [error, setError] = useState('')

  const isLoadingSession = status === 'loading'
  const isAuthenticated = !!session?.user

  const handleSubmit = async (published: boolean) => {
    if (!title.trim() || !content.trim()) {
      setError('Please add a title and some content')
      return
    }

    if (!isAuthenticated) {
      router.push('/signin')
      return
    }

    setError('')
    setIsPublishing(true)

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        content,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        published,
      })

      router.push('/dashboard')
    } catch (err) {
      console.error('Create post error', err)
      setError('Failed to save your story. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  if (isLoadingSession) {
    return (
      <div className="py-16 flex justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="py-16 flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4">You need an account to write</h1>
        <button
          type="button"
          onClick={() => router.push('/signin')}
          className="bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
        >
          Sign in to continue
        </button>
      </div>
    )
  }

  return (
      <div className="py-10 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Write a story</h1>
            <p className="mt-2 text-gray-600">
              Share your ideas with the world. You can save a draft or publish when you&apos;re
              ready.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full text-3xl font-bold border-0 border-b text-black border-gray-200 focus:border-gray-400 focus:ring-0 px-0 py-2 bg-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. javascript, webdev, life"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              />
            </div>

            <RichTextEditor value={content} onChange={setContent} />

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => handleSubmit(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium bg-green-300 text-black  disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Save as draft
              </button>
              <button
                type="button"
                disabled={isPublishing}
                onClick={() => handleSubmit(true)}
                className="px-6 py-2 rounded-full bg-green-300 text-sm font-medium text-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}


