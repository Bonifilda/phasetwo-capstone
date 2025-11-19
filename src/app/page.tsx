
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Test Header directly */}
      <Header />
      
      <main className="flex-1">
        <section className="bg-blue-100 to-green-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Welcome to Medium Platform
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                A modern publishing platform where you can share your stories, 
                connect with readers, and build your audience.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500  focus-visible:outline-green-600"
                >
                  Start Writing
                </Link>
                <Link
                  href="/posts"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Read Stories <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Test Footer directly */}
      <Footer />
    </div>
  )
}
