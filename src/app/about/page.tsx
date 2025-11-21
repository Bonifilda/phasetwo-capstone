export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            About Medium Platform
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 text-gray-600 max-w-xl lg:max-w-2xl mx-auto px-4">
            A modern publishing platform inspired by Medium, built with Next.js, 
            TypeScript, and MongoDB.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="px-4 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-6 sm:leading-7">
              We believe everyone has a story to tell. Our platform empowers writers 
              to share their ideas, connect with readers, and build their audience 
              in a beautiful, distraction-free environment.
            </p>
          </div>
          
          <div className="px-4 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Features</h2>
            <ul className="text-sm sm:text-base text-gray-600 space-y-2 leading-6 sm:leading-7">
              <li>• Rich text editor for beautiful writing</li>
              <li>• Social features like comments and likes</li>
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