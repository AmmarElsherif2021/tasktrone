/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listProjects } from '../API/projects'
import { useAuth } from '../contexts/AuthContext'
import { getUserInfo } from '../API/users'
import supabaseClient from '../lib/supabaseClient'

const UserHomeContext = createContext()

export const UserHomeProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()

  // Context states
  const [currentUser, setCurrentUser] = useState({})
  const [userProjectDetails, setUserProjectDetails] = useState([])

  // Get user info query - now includes projects array
  const currentUserQuery = useQuery({
    queryKey: ['users', { userId: user?.id }],
    queryFn: () => getUserInfo(user?.id),
    enabled: !!user?.id && isAuthenticated,
    retry: 2,
  })
  // set current user from query result
  useEffect(() => {
  if (currentUserQuery.data) {
    setCurrentUser(currentUserQuery.data)
    if (currentUserQuery.data?.projects?.length > 0) {
      fetchUserProjects(currentUserQuery.data.projects)
    }
  }
}, [currentUserQuery.data])
  // Fetch full project details for the user's project IDs
  const fetchUserProjects = async (projectIds) => {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select(`
          *,
          creator:users!projects_created_by_fkey(id, username, full_name),
          project_manager:users!projects_project_manager_fkey(id, username, full_name)
        `)
        .in('id', projectIds)

      if (error) throw error
      setUserProjectDetails(data || [])
    } catch (error) {
      console.error('Error fetching user projects:', error)
    }
  }

  // Watch for changes in currentUser.projects
  useEffect(() => {
    if (currentUser?.projects?.length > 0) {
      fetchUserProjects(currentUser.projects)
    } else {
      setUserProjectDetails([])
    }
  }, [currentUser?.projects])

  // Projects query (for all projects user is member of via project_members)
  const projectsQuery = useQuery({
    queryKey: ['projects', { sortBy: 'createdAt', sortOrder: 'desc' }],
    queryFn: () =>
      listProjects(user?.id, {
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: !!user?.id && isAuthenticated,
    retry: 2,
  })

  // Combined projects - direct (from users.projects) and via membership
  const allUserProjects = [
    ...(userProjectDetails || []),
    ...(projectsQuery.data || [])
  ].filter((project, index, self) => 
    index === self.findIndex(p => p.id === project.id)
  )

  // Refresh all project data
  const refreshProjects = async () => {
    await projectsQuery.refetch()
    if (currentUser?.projects?.length > 0) {
      await fetchUserProjects(currentUser.projects)
    }
  }

  // Handle user profile data from auth providers
  useEffect(() => {
    if (user && Object.keys(currentUser).length === 0) {
      const authUserData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        //avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        provider: user.app_metadata?.provider || 'email',
        projects: [] // Initialize empty projects array
      }
      setCurrentUser(authUserData)
    }
  }, [user, currentUser])
  useEffect(() => {
    if (user && !currentUser.id) {
      console.log(`All users projects: ${allUserProjects}, 
        And users projects details: ${userProjectDetails}
        And the current user is: ${currentUser}`)}}
        ,[user, currentUser, allUserProjects, userProjectDetails])
  return (
    <UserHomeContext.Provider
      value={{
        // All projects the user has access to (direct + membership)
        userProjects: allUserProjects,
        // Projects directly assigned via users.projects
        directProjects: userProjectDetails,
        // Projects via project_members table
        memberProjects: projectsQuery.data || [],
        currentUser,
        setCurrentUser,
        refreshProjects,
        isUserLoading: authLoading || currentUserQuery.isLoading || currentUserQuery.isFetching,
        areProjectsLoading: 
          projectsQuery.isLoading || 
          projectsQuery.isFetching ||
          (currentUser?.projects?.length > 0 && userProjectDetails.length === 0),
        isAuthenticated,
        // Helper to check if user owns a project
        isProjectOwner: (projectId) => currentUser?.projects?.includes(projectId),
      }}
    >
      {children}
    </UserHomeContext.Provider>
  )
}

export const useUserHome = () => {
  const context = useContext(UserHomeContext)
  if (!context) {
    throw new Error('useUserHome must be used within a UserHomeProvider')
  }
  return context
}