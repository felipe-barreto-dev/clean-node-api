'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import type { Poll } from '@/types/api'

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, logout } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && !api.getToken()) {
      router.push('/login')
      return
    }

    const fetchPolls = async () => {
      try {
        const data = await api.getPolls()
        setPolls(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch polls')
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [isAuthenticated, router])

  const handleLogout = async () => {
    await api.logout()
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading polls...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Polls</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">{error}</div>
          </div>
        )}

        {polls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No polls available</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <div
                key={poll.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {poll.question}
                  </h3>
                  <div className="space-y-2">
                    {poll.options.map((option) => (
                      <button
                        key={option.option}
                        onClick={() => handleVote(poll.id, option.option)}
                        className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {option.option}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {new Date(poll.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )

  async function handleVote(pollId: string, option: string) {
    try {
      await api.vote(pollId, option)
      // Refresh polls or show result
      const result = await api.getPollResult(pollId)
      console.log('Vote result:', result)
      // You could navigate to results page or show a modal
      alert(`Vote recorded for: ${option}`)
    } catch (err) {
      alert('Failed to vote: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }
}
