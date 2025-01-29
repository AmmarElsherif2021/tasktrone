/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import { getProjectById, updateTasksCycleTime } from '../API/projects'
import { getUserInfo } from '../API/users'
import { useAuth } from '../contexts/AuthContext'
import { listTasks } from '../API/tasks'

const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
  const [token] = useAuth()

  // Context states
  const [currentProjectId, setCurrentProjectId] = useState('')
  const [currentProject, setCurrentProject] = useState('')
  const [currentProjectMembers, setCurrentProjectMembers] = useState([])
  const [currentAvgLeadTime, setCurrentAvgLeadTime] = useState(0)
  const [currentAvgCycleTime, setCurrentAvgCycleTime] = useState(0)
  const [currentTasks, setCurrentTasks] = useState([])
  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const queryClient = new QueryClient()
  // Project query
  const currentProjectQuery = useQuery({
    queryKey: ['project', currentProjectId],
    queryFn: () => getProjectById(currentProjectId, token),
    enabled: !!currentProjectId,
  })

  // Separate query for users data
  const usersDataQuery = useQuery({
    queryKey: ['project-users', currentProjectId],
    queryFn: async () => {
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
    enabled: false,
  })

  // In ProjectContext.jsx
  const tasksQuery = useQuery({
    queryKey: ['tasks', currentProjectId],
    queryFn: () => {
      setIsTasksLoading(true)
      return listTasks(currentProjectId, {})
    },
    select: (data) =>
      data.map((task) => ({
        _id: task._id,
        project: task.project,
        title: task.title,
        author: task.author,
        taskType: task.taskType,
        leadTime: task.leadTime,
        cycleTime: task.cycleTime,
        startDate: task?.startDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        dueDate: task.dueDate,
        phase: task.phase,
        members: task.members || [],
      })),
    enabled: !!currentProjectId,
    onSettled: () => setIsTasksLoading(false),
    staleTime: 30000, // caching to prevent unnecessary refreshes
    retry: 2,
  })

  // Trigger users fetch when project is loaded
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

  // Update project members when users are fetched
  useEffect(() => {
    if (usersDataQuery.data) {
      setCurrentProjectMembers(usersDataQuery.data)
    }
  }, [usersDataQuery.data])

  // Update currentTasks state with improved reliability
  useEffect(() => {
    if (tasksQuery.data) {
      setCurrentTasks(tasksQuery.data)
    }
  }, [tasksQuery.data, currentProjectId])

  //update cycleTimes
  const cycleTimesMutation = useMutation({
    mutationFn: () => updateTasksCycleTime(token, currentProjectId),
    onSuccess: (data) => {
      console.log(`Successfully updated ${data.updatedCount} tasks`)
      // Invalidate and refetch tasks
      queryClient.invalidateQueries(['tasks', currentProjectId])
    },
    onError: (error) => {
      console.error('Failed to update cycle times:', error)
    },
  })
  // refreshTasks method
  const refreshTasks = () => {
    cycleTimesMutation.mutate()
    tasksQuery.refetch()
  }

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
        currentTasks,
        setCurrentTasks,
        isTasksLoading,
        setIsTasksLoading,
        usersDataQuery,
        refreshTasks,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => useContext(ProjectContext)
