import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listProjects } from '../API/projects'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { getUserInfo } from '../API/users' // getUserProfileImage to be added

const UserHomeContext = createContext()

// eslint-disable-next-line react/prop-types
export const UserHomeProvider = ({ children }) => {
  const [token] = useAuth()
  //const queryClient = useQueryClient()

  const decodeToken = (token) => {
    if (!token || typeof token !== 'string') {
      console.error('Invalid token format:', typeof token)
      return null
    }

    try {
      const decoded = jwtDecode(token)
      console.log('Token decoded successfully:', {
        sub: decoded.sub,
        exp: new Date(decoded.exp * 1000).toISOString(),
      })
      return { userId: decoded.sub }
    } catch (error) {
      console.error('Token decode error:', error)
      return null
    }
  }
  const userData = decodeToken(token)

  // Context states
  const [currentUser, setCurrentUser] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [userProjects, setUserProjects] = useState([])
  //const [currentProfile, setCurrentProfile] = useState({})

  // Queries
  const currentUserQuery = useQuery({
    queryKey: ['users', { userId: userData?.userId }],
    queryFn: () => getUserInfo(userData?.userId),
  })

  //   const userProfileQuery = useQuery({
  //     queryKey: ['users', 'profile-image', { userId: userData?.userId }],
  //     queryFn: () => getUserProfileImage(userData?.userId),
  //   })

  const projectsQuery = useQuery({
    queryKey: ['projects', { userId: userData?.userId }],
    queryFn: () => listProjects({ userId: userData?.userId }),
    enabled: !!userData?.userId,
  })

  // Context data
  const current = currentUserQuery.data ?? {}
  //const currentUserProfile = userProfileQuery.data ?? {}
  const projects = projectsQuery.data ?? []

  // Invoke context state
  useEffect(() => {
    if (current) {
      setCurrentUser(current)
    }
  }, [])
  //   useEffect(() => {
  //     if (userProfileQuery.data) {
  //       setCurrentProfile(userProfileQuery.data)
  //     }
  //   }, [userProfileQuery.data])

  useEffect(() => {
    if (projects) {
      setIsVisible(projects.length > 0)
      setUserProjects(projects)
    }
  }, [currentUser])

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  // Confirm context state
  useEffect(() => {
    console.log(
      `CurrentUserData from user context ${JSON.stringify(currentUser)}`,
    )
    console.log(
      `userprojects from user context ${JSON.stringify(userProjects)}`,
    )
    // console.log(
    //   `userProfile from user context ${currentProfile} ------------------------------------`,
    // )
  }, [currentUser, userProjects]) // currentProfile to be added later !!! important

  return (
    <UserHomeContext.Provider
      value={{
        isVisible,
        toggleVisibility,
        userProjects,
        currentUser,
        setCurrentUser,
        //currentProfile,
      }}
    >
      {children}
    </UserHomeContext.Provider>
  )
}

export const useUserHome = () => useContext(UserHomeContext)
