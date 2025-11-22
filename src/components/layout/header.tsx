'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/signin')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (status === 'loading') {
    return (
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                Medium
              </Link>
            </div>
            <div className="text-gray-600">Loading...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-green-600 transition-colors">
              Medium
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Home
            </Link>
            <Link href="/posts" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Stories
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              About
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {session?.user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Profile
                </Link>
                <button onClick={handleSignOut} className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-green-600 text-white px-3 py-2 lg:px-4 rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/posts" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                Stories
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              
              {session?.user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="text-left text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-gray-600 hover:text-gray-900 transition-colors font-medium px-2 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors mx-2 text-center" onClick={() => setIsMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts, users, tags..."
        className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <svg
        className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </form>
  )
}