import { connectToDatabase } from '@/lib/db'

export default async function TestDBPage() {
  let status: 'success' | 'error' = 'success'
  let message = 'Database connected successfully!'

  try {
    await connectToDatabase()
  } catch (error) {
    status = 'error'
    message = error instanceof Error ? error.message : 'Failed to connect to database'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Database Connection Test
          </h2>
        </div>

        <div
          className={`p-4 rounded-md ${
            status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          } border`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {status === 'success' ? (
                <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}