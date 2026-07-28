/**
 * Signup.jsx  (updated)
 * ──────────────────────────────────────────────────────────────
 * Rendered inside <AuthLayout>.
 *
 * REMOVED:
 *   ✕  `min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4`
 *   ✕  `max-w-md` wrapper  → AuthLayout provides it
 * ──────────────────────────────────────────────────────────────
 */
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../API/users'

export function Signup() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const navigate = useNavigate()

  const signupMutation = useMutation({
    mutationFn: () => signup({ email, password }),
    onSuccess:  () => navigate('/complete-profile', { replace: true }),
    onError:    (err) => setError(err.message || 'Failed to sign up. Please try again.'),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    signupMutation.mutate()
  }

  // AuthLayout provides the max-w-md centering wrapper
  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manufacturing Kanban Tool
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
        {error && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Min. 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={!email || !password || signupMutation.isPending}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {signupMutation.isPending ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-gray-800 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}