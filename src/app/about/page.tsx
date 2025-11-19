export default function AboutPage() {
  return (
    <div className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            About Medium Platform
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            A modern publishing platform inspired by Medium, built with Next.js, 
            TypeScript, and Supabase.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              We believe everyone has a story to tell. Our platform empowers writers 
              to share their ideas, connect with readers, and build their audience 
              in a beautiful, distraction-free environment.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Rich text editor for beautiful writing</li>
              <li>• Social features like comments and claps</li>
              <li>• User profiles and following system</li>
              <li>• Tag-based organization</li>
              <li>• SEO optimized pages</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}