import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Clean Node API
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Polls & Surveys Platform
          </p>
          <p className="text-gray-500 mb-8">
            A modern polling platform built with Clean Architecture, TDD, and TypeScript
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-2xl mb-2">🔐</div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Auth</h3>
                <p className="text-sm text-gray-600">JWT-based authentication with role-based access control</p>
              </div>
              <div>
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900 mb-1">Real-time Polls</h3>
                <p className="text-sm text-gray-600">Create and vote on polls with instant results</p>
              </div>
              <div>
                <div className="text-2xl mb-2">🏗️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Clean Architecture</h3>
                <p className="text-sm text-gray-600">Built with SOLID principles and TDD</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>Built with Next.js, TypeScript, and MongoDB</p>
          </div>
        </div>
      </div>
    </div>
  )
}
