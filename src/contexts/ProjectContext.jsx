/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from '../API/projects'
import { getUserInfo } from '../API/users'
import { useAuth } from '../contexts/AuthContext'

const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
  const [token] = useAuth()

  // Context states
  const [currentProjectId, setCurrentProjectId] = useState('')
  const [currentProject, setCurrentProject] = useState('')
  const [currentProjectMembers, setCurrentProjectMembers] = useState([])
  const [currentAvgLeadTime, setCurrentAvgLeadTime] = useState(0)
  const [currentAvgCycleTime, setCurrentAvgCycleTime] = useState(0)

  // Project query - kept simple and focused on project data
  const currentProjectQuery = useQuery({
    queryKey: ['project', currentProjectId],
    queryFn: () => getProjectById(currentProjectId, token),
    enabled: !!currentProjectId,
  })

  // Separate query for users data - now more flexible and independent
  const usersDataQuery = useQuery({
    queryKey: ['project-users', currentProjectId],
    queryFn: async () => {
      // Only try to fetch users if project members exist
      if (!currentProject?.members?.length) return []

      try {
        const userPromises = currentProject.members.map(async (member) => {
          try {
            return await getUserInfo(member.user)
          } catch (userFetchError) {
            console.error(
              `Failed to fetch user ${member.user}:`,
              userFetchError,
            )
            return null
          }
        })

        const users = await Promise.all(userPromises)
        return users.filter((user) => user !== null)
      } catch (error) {
        console.error('Failed to fetch project users:', error)
        return []
      }
    },
    // Important: Make this query manually triggered !!!!!
    enabled: false,
  })

  // Trigger users fetch when project is loaded and has members
  useEffect(() => {
    if (currentProject?.members?.length) {
      usersDataQuery.refetch()
    }
  }, [currentProject])

  // Handle project query result
  useEffect(() => {
    if (currentProjectQuery?.data) {
      setCurrentProject(currentProjectQuery.data)
    }
  }, [currentProjectQuery])

  // update project members when users are fetched..
  useEffect(() => {
    if (usersDataQuery.data) {
      setCurrentProjectMembers(usersDataQuery.data)
    }
  }, [usersDataQuery.data])

  return (
    <ProjectContext.Provider
      value={{
        currentProjectId,
        setCurrentProjectId,
        currentProject,
        setCurrentProject,
        currentProjectMembers,
        setCurrentProjectMembers,
        currentAvgLeadTime,
        setCurrentAvgLeadTime,
        currentAvgCycleTime,
        setCurrentAvgCycleTime,
        usersDataQuery,
      }}
    >
      {' '}
      {children}{' '}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
