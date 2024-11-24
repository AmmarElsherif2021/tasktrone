import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from '../API/projects'
//import { useAuth } from '../contexts/AuthContext'
//import { jwtDecode } from 'jwt-decode'
// getUserProfileImage to be added
//import { useUserHome } from './UserHomeContext'

const ProjectContext = createContext()

// eslint-disable-next-line react/prop-types
export const ProjectProvider = ({ children }) => {
  // const [token] = useAuth()
  //const queryClient = useQueryClient()

  //   const decodeToken = (token) => {
  //     if (!token || typeof token !== 'string') {
  //       console.error('Invalid token format:', typeof token)
  //       return null
  //     }

  //     try {
  //       const decoded = jwtDecode(token)
  //       console.log('Token decoded successfully:', {
  //         sub: decoded.sub,
  //         exp: new Date(decoded.exp * 1000).toISOString(),
  //       })
  //       return { projectId: decoded.sub }
  //     } catch (error) {
  //       console.error('Token decode error:', error)
  //       return null
  //     }
  //   }
  //   const currentProject = decodeToken(token)
  //get current user data

  // Context states
  const [currentProject, setCurrentProject] = useState({})

  //const [projectInfo, setProjectInfo] = useState(null)
  //const [currentProfile, setCurrentProfile] = useState({})

  // Queries
  const currentProjectQuery = useQuery({
    queryKey: ['project', { projectId: currentProject?._id }],
    queryFn: () => getProjectById(currentProject?.projectId),
  })

  //   const userProfileQuery = useQuery({
  //     queryKey: ['projects', 'profile-image', { projectId: currentProject?._id }],
  //     queryFn: () => getUserProfileImage(currentProject?.projectId),
  //   })

  // Context data
  const current = currentProjectQuery.data ?? {}
  //const currentProjectProfile = userProfileQuery.data ?? {}
  //const projects = projectsQuery.data ?? []

  // Invoke context state
  useEffect(() => {
    if (current) {
      setCurrentProject(current)
    }
  }, [])
  //   useEffect(() => {
  //     if (userProfileQuery.data) {
  //       setCurrentProfile(userProfileQuery.data)
  //     }
  //   }, [userProfileQuery.data])

  // Confirm context state
  useEffect(() => {
    console.log(
      `currentProjectData from user context ${JSON.stringify(currentProject)}`,
    )
  }, [currentProject]) // currentProfile to be added later

  return (
    <ProjectContext.Provider
      value={{
        // projectInfo,
        currentProject,
        setCurrentProject,
        //currentProfile,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
