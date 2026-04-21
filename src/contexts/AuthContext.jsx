import { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import supabase from '../../supabaseClient'

export const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  setSession: () => {},
})

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
   if (mounted) {
      setSession(prev => prev ?? session)  // don't overwrite if onAuthStateChange already set it
      setLoading(false)
    }
  })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        console.log('|||||||||||||||||||| AuthContext - Auth state changed:', event, JSON.stringify(session?.user))
        setSession(session)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user: session?.user || null,
    loading,
    setSession,
    // Helper methods
    isAuthenticated: !!session,
    accessToken: session?.access_token || null,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthContextProvider')
  }
  return context
}

// Backward compatibility - returns accessToken for existing code
export function useAuthToken() {
  const { session } = useAuth()
  return [session?.access_token || null, () => {}]
}