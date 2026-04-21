/**
 * Home.jsx (Tailwind + DRY refactor)
 * ──────────────────────────────────────────────────────────────
 * - Removed react-bootstrap imports (Container, Button)
 * - Replaced with Tailwind CSS classes
 * - Custom Button component extracted for reuse
 * - FullContentScreen uses Tailwind utilities
 * - No inline styles, all styling via Tailwind
 */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { useUserHome } from '../../contexts/UserHomeContext'
import { useAuth } from '../../contexts/AuthContext'
import NewMemberExplorer from './NewMemberExplorer'
import OldMemberExplorer from './OldMemberExplorer'
import logo from '../../assets/logo.svg'

// ── Shared wrapper for full-content-area screens ──────────────
const FullContentScreen = ({ children }) => (
  <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-h))] text-center px-4">
    {children}
  </div>
)

// ── Reusable Button component (Tailwind) ──────────────────────
const CustomButton = ({ children, variant = 'dark', onClick, to }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors"
  const variants = {
    dark: "bg-neutral-black text-white hover:bg-gray-800",
    light: "bg-teal-600 text-black hover:bg-teal-500"
  }
  const buttonClasses = `${baseClasses} ${variants[variant] || variants.dark}`

  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {children}
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={buttonClasses}>
      {children}
    </button>
  )
}

// ── Welcome (unauthenticated) ─────────────────────────────────
const WelcomeScreen = () => (
  <FullContentScreen>
    <img src={logo} alt="Tasktrone" className="w-1/5 mb-12 max-w-[10rem]" />
    <h2 className="mb-4 text-2xl font-bold">Welcome to Tasktrone!</h2>
    <p className="mb-6 text-gray-600 max-w-sm">
      Please sign in or sign up to start managing your projects.
    </p>
    <div className="flex gap-3">
      <CustomButton to="/login" variant="dark">Login</CustomButton>
      <CustomButton to="/signup" variant="light">Sign up</CustomButton>
    </div>
  </FullContentScreen>
)

// ── Loading ───────────────────────────────────────────────────
const LoadingScreen = () => (
  <FullContentScreen>
    <img src={logo} alt="Tasktrone" className="w-1/5 mb-12 max-w-[10rem]" />
    <h2 className="mb-2 text-xl font-semibold">Loading…</h2>
    <p className="text-gray-500">Setting up your workspace</p>
  </FullContentScreen>
)

// ── Main component ────────────────────────────────────────────
export function Home() {
  const { userProjects, isUserLoading, areProjectsLoading } = useUserHome()
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  if (authLoading)                           return <LoadingScreen />
  if (!isAuthenticated || !user)             return <WelcomeScreen />
  if (isUserLoading || areProjectsLoading)   return <LoadingScreen />

  return (
    <div className="w-full min-h-[calc(100vh-var(--header-h))] bg-[#EEFBF4]">
      {userProjects.length === 0 ? (
        <NewMemberExplorer userId={user.id} />
      ) : (
        <OldMemberExplorer userId={user.id} />
      )}
    </div>
  )
}