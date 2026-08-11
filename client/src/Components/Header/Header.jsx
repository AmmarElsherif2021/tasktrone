import { useAuth } from '../../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-negative.svg'
import { useProject } from '../../contexts/ProjectContext'
import IconButton from '../../Ui/IconButton'
import logoutIcon from '../../assets/logout.svg'
import dashboardIcon from '../../assets/negative-dashboard.svg'
import { useUserHome } from '../../contexts/UserHomeContext'
import supabaseClient from '../../lib/supabaseClient'

export function Header() {
  const { user, isAuthenticated } = useAuth()
  const { currentUser, setCurrentUser } = useUserHome()
  const navigate = useNavigate()
  const { setCurrentProjectId } = useProject()

  const handleLogout = async () => {
    try {
      await supabaseClient.auth.signOut()
      setCurrentUser({})
      setCurrentProjectId('')
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      navigate('/')
    }
  }

  const getDisplayName = () => {
    if (currentUser?.username) return currentUser.username
    if (currentUser?.full_name) return currentUser.full_name
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.user_metadata?.name) return user.user_metadata.name
    if (user?.email) return user.email.split('@')[0]
    return 'User'
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-black z-50 px-6 py-2 h-[var(--header-h)]">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" onClick={() => setCurrentProjectId('')}>
          <img src={logo} width={30} alt="Tasktrone Logo" />
        </Link>

        <div className="flex justify-end items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <span className="text-white text-sm">Logged in as {getDisplayName()}</span>
              <IconButton
                src={dashboardIcon}
                alt="Dashboard"
                onClick={() => {
                  setCurrentProjectId('')
                  navigate('/dashboard')
                }}
                iconWidthREM={5}
                color="#ffffff"
              />
              <IconButton
                src={logoutIcon}
                alt="Sign out"
                onClick={handleLogout}
                iconWidthREM={5}
                color="#ffffff"
              />
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-gray-300">Log In</Link>
              <Link to="/signup" className="text-white hover:text-gray-300">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}