
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/header'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Test Header directly */}
      <Header />
      
      <main className="flex-1">
        <section className="bg-gradient-to-br from-blue-50 to-green-50 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Welcome to Medium Platform
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-gray-600 max-w-xl lg:max-w-2xl mx-auto px-4">
                A modern publishing platform where you can share your stories, 
                connect with readers, and build your audience.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 px-4">
                <Link
                  href="/signup"
                  className="w-full sm:w-auto rounded-md bg-green-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-green-600 transition-colors text-center"
                >
                  Start Writing
                </Link>
                <Link
                  href="/posts"
                  className="w-full sm:w-auto text-sm sm:text-base font-semibold leading-6 text-gray-900 hover:text-green-600 transition-colors text-center"
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
