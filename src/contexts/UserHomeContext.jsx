import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listProjects } from '../API/projects'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { getUserInfo } from '../API/users' // getUserProfileImage to be added

const UserHomeContext = createContext()

// eslint-disable-next-line react/prop-types
export const UserHomeProvider = ({ children }) => {
  const [token] = useAuth()

  // Function to decode the token
  const decodeToken = useMemo(
    () => (token) => {
      if (!token || typeof token !== 'string') {
        console.error('Invalid token format:', typeof token)
        return null
      }

      try {
        const decoded = jwtDecode(token)
        console.log('Token decoded successfully:', JSON.stringify(decoded), {
          sub: decoded.sub,
          exp: new Date(decoded.exp * 1000).toISOString(),
        })
        return { userId: decoded.sub }
      } catch (error) {
        console.error('Token decode error:', error)
        return null
      }
    },
    [],
  )

  const userData = decodeToken(token)

  // Context states
  const [currentUser, setCurrentUser] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [userProjects, setUserProjects] = useState([])

  // Queries
  const currentUserQuery = useQuery({
    queryKey: ['users', { userId: userData?.userId }],
    queryFn: () => getUserInfo(userData?.userId),
    enabled: !!userData?.userId, // Ensures the query runs only if userId is available
  })
  const projectsQuery = useQuery({
    queryKey: ['projects', { sortBy: 'createdAt', sortOrder: 'desc' }],
    queryFn: () =>
      listProjects(userData?.userId, {
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: !!token,
  })

  // Context data
  const current = currentUserQuery.data ?? {}
  const projects = projectsQuery.data ?? []

  // Invoke context state
  useEffect(() => {
    if (Object.keys(current).length > 0) {
      setCurrentUser(current)
      console.log(
        `-------=============------$$$$$$$----------===================---------currentUser ${JSON.stringify(
          currentUser,
        )}`,
      )
    }
  }, [current])

  useEffect(() => {
    setIsVisible(true)
    // console.log(
    //   ` @@@@@@@@@@@@@@@@@@@@@ projects of current user: ${JSON.stringify(
    //     projects,
    //   )}`,
    // )
    setUserProjects(projects)
  }, [current, projects])

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  // Confirm context state
  // useEffect(() => {
  //   console.log(
  //     `CurrentUserData from user context ${JSON.stringify(currentUser)}`,
  //   )
  //   console.log(
  //     `userprojects from user context ${JSON.stringify(userProjects)}`,
  //   )
  // }, [current, projects, currentUser, userProjects])

  return (
    <UserHomeContext.Provider
      value={{
        isVisible,
        toggleVisibility,
        userProjects,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </UserHomeContext.Provider>
  )
}

export const useUserHome = () => useContext(UserHomeContext)
