'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface SearchResults {
  posts?: Array<{
    _id: string
    title: string
    content: string
    author: {
      name: string
      username: string
    }
    createdAt: string
  }>
  users?: Array<{
    _id: string
    name: string
    username: string
  }>
  tags?: Array<{
    _id: string
    name: string
    slug: string
  }>
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<SearchResults>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      searchContent(query)
    }
  }, [query])

  const searchContent = async (searchQuery: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-black">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">
          Search Results for "{query}"
        </h1>

        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Searching...</div>
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
            {/* Posts */}
            {results.posts && results.posts.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Posts</h2>
                <div className="space-y-4">
                  {results.posts.map((post) => (
                    <div key={post._id} className="bg-white p-6 rounded-lg shadow-sm">
                      <Link href={`/posts/${post._id}`} className="hover:text-green-600">
                        <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                      </Link>
                      <p className="text-gray-600 mb-3">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>By {post.author.name}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Users */}
            {results.users && results.users.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Users</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.users.map((user) => (
                    <div key={user._id} className="bg-white p-4 rounded-lg shadow-sm">
                      <Link href={`/users/${user.username}`} className="hover:text-green-600">
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-gray-600">@{user.username}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tags */}
            {results.tags && results.tags.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {results.tags.map((tag) => (
                    <Link
                      key={tag._id}
                      href={`/tags/${tag.slug}`}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm hover:bg-green-200"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* No results */}
            {!loading && 
             (!results.posts?.length && !results.users?.length && !results.tags?.length) && (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}