/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listProjects } from '../API/projects'
import { useAuth } from '../contexts/AuthContext'
import { jwtDecode } from 'jwt-decode'
import { getUserInfo } from '../API/users'

const UserHomeContext = createContext()

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

  // Queries
  const currentUserQuery = useQuery({
    queryKey: ['users', { userId: userData?.userId }],
    queryFn: () => getUserInfo(userData?.userId),
    enabled: !!userData?.userId,
    retry: 2,
    onSuccess: (data) => {
      setCurrentUser(data)
    },
  })
  useEffect(() => {
    if (Object.keys(currentUser).length > 0) {
      console.log(`currentUser ${JSON.stringify(currentUser)}`)
    } else {
      currentUserQuery.refetch
    }
  }, [currentUser, userData?.userId])
  const projectsQuery = useQuery({
    queryKey: ['projects', { sortBy: 'createdAt', sortOrder: 'desc' }],
    queryFn: () =>
      listProjects(userData?.userId, {
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: !!token,
    retry: 2,
  })

  // Context data
  const userProjects = projectsQuery.data ?? []

  // Refresh projects function
  const refreshProjects = () => {
    projectsQuery.refetch()
  }

  return (
    <UserHomeContext.Provider
      value={{
        userProjects,
        currentUser,
        setCurrentUser,
        refreshProjects,
        isUserLoading:
          currentUserQuery.isLoading || currentUserQuery.isFetching,
        areProjectsLoading: projectsQuery.isLoading || projectsQuery.isFetching,
      }}
    >
      {children}
    </UserHomeContext.Provider>
  )
}

export const useUserHome = () => useContext(UserHomeContext)
