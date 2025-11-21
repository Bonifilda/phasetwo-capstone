import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">
              Medium
            </Link>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
              A platform to share your stories and ideas with the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-3 sm:mt-4 space-y-2">
              <li><Link href="/features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link></li>
              <li><Link href="/api" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
            <ul className="mt-3 sm:mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-3 sm:mt-4 space-y-2">
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms</Link></li>
              <li><Link href="/cookies" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Medium Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}