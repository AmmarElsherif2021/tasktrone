import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjectById, updateProject } from '../API/projects'
import { getPosts } from '../API/posts'
import { useAuth } from '../contexts/AuthContext'
import { listTasks } from '../API/tasks'
import { getAllUsers } from '../API/users'

const ProjectContext = createContext()

export const useProject = () => useContext(ProjectContext)

export const ProjectProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Context states
  const [currentProjectId, setCurrentProjectId] = useState('')
  const [currentProject, setCurrentProject] = useState(null)
  const [currentProjectMembers, setCurrentProjectMembers] = useState([])
  const [currentAvgLeadTime, setCurrentAvgLeadTime] = useState(0)
  const [currentAvgCycleTime, setCurrentAvgCycleTime] = useState(0)
  const [currentTasks, setCurrentTasks] = useState([])
  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [shouldFetchUsers, setShouldFetchUsers] = useState(false)

  // Blog filters
  const [postAuthorFilter, setPostAuthorFilter] = useState('')
  const [postSortBy, setPostSortBy] = useState('created_at')
  const [postSortOrder, setPostSortOrder] = useState('desc')

  // ── Project query ──────────────────────────────────────────
  const currentProjectQuery = useQuery({
    queryKey: ['project', currentProjectId],
    queryFn: () => getProjectById(currentProjectId),
    enabled: !!currentProjectId && isAuthenticated,
    select: (data) => ({
      ...data,
      members: data.project_members?.map(member => ({
        user_id: member.user.id,
        role: member.role,
        username: member.user.username,
        full_name: member.user.full_name,
        team: member.user.team,
        joined_at: member.joined_at
      })) || []
    }),
    staleTime: 30000,
    retry: 2
  })

  // ── Tasks query ────────────────────────────────────────────
  const tasksQuery = useQuery({
    queryKey: ['tasks', currentProjectId],
    queryFn: () => {
      setIsTasksLoading(true)
      return listTasks(currentProjectId, {})
    },
    select: (data) =>
      data.map((task) => ({
        _id: task.id,
        project: task.project_id,
        title: task.title,
        author: task.created_by,
        taskType: task.task_type,
        leadTime: task.lead_time,
        cycleTime: task.cycle_time,
        startDate: task.start_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        dueDate: task.due_date,
        phase: task.phase,
        status: task.status,
        members: task.task_members || [],
      })),
    enabled: !!currentProjectId && isAuthenticated,
    staleTime: 30000,
    retry: 2,
  })

  // ── Posts query ────────────────────────────────────────────
  const postsQuery = useQuery({
    queryKey: ['posts', currentProjectId, {
      author: postAuthorFilter,
      sortBy: postSortBy,
      sortOrder: postSortOrder
    }],
    queryFn: () => getPosts(currentProjectId, {
      author: postAuthorFilter,
      sortBy: postSortBy,
      sortOrder: postSortOrder
    }),
    enabled: !!currentProjectId && isAuthenticated,
    staleTime: 1000 * 60,
  })

  // ── Users query (lazy) ─────────────────────────────────────
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    enabled: shouldFetchUsers,
    staleTime: 5 * 60 * 1000,
  })

  // ── Derived metrics (computed in context, not in Board) ────
  useEffect(() => {
    if (tasksQuery.data) {
      const tasks = tasksQuery.data
      const totalCycle = tasks.reduce((acc, t) => acc + (t.cycleTime || 0), 0)
      const totalLead = tasks.reduce((acc, t) => acc + (t.leadTime || 0), 0)
      setCurrentAvgCycleTime(tasks.length ? totalCycle / tasks.length : 0)
      setCurrentAvgLeadTime(tasks.length ? totalLead / tasks.length : 0)
    } else {
      setCurrentAvgCycleTime(0)
      setCurrentAvgLeadTime(0)
    }
  }, [tasksQuery.data])

  // ── Side effects ───────────────────────────────────────────
  useEffect(() => {
    if (!tasksQuery.isLoading) setIsTasksLoading(false)
  }, [tasksQuery.isLoading])

  useEffect(() => {
    if (currentProjectQuery?.data) {
      setCurrentProject(currentProjectQuery.data)
      setCurrentProjectMembers(currentProjectQuery.data.members || [])
    }
  }, [currentProjectQuery.data])

  useEffect(() => {
    if (tasksQuery.data) {
      setCurrentTasks(tasksQuery.data)
    }
  }, [tasksQuery.data, currentProjectId])

  useEffect(() => {
    if (!currentProjectId) {
      setCurrentProject(null)
      setCurrentProjectMembers([])
      setCurrentTasks([])
    }
  }, [currentProjectId])

  // ── Mutations ──────────────────────────────────────────────
  const updateWipMutation = useMutation({
    mutationFn: ({ projectId, wip }) =>
      updateProject(projectId, { wip_limit: wip }),
    onSuccess: () => {
      queryClient.invalidateQueries(['project', currentProjectId])
    },
  })

  // ── Helpers ────────────────────────────────────────────────
  const updatePostFilters = ({ author, sortBy, sortOrder }) => {
    if (author !== undefined) setPostAuthorFilter(author)
    if (sortBy !== undefined) setPostSortBy(sortBy)
    if (sortOrder !== undefined) setPostSortOrder(sortOrder)
  }

  const refetchPosts = () => postsQuery.refetch()
  const refreshTasks = () => tasksQuery.refetch()
  const refreshProject = () => currentProjectQuery.refetch()
  const fetchUsers = () => setShouldFetchUsers(true)

  return (
    <ProjectContext.Provider
      value={{
        currentProjectId,
        setCurrentProjectId,
        currentProject,
        currentProjectMembers,
        currentAvgLeadTime,
        setCurrentAvgLeadTime,
        currentAvgCycleTime,
        setCurrentAvgCycleTime,
        currentTasks,
        isTasksLoading,
        refreshTasks,
        refreshProject,
        updateWipMutation,
        isProjectLoading: currentProjectQuery.isLoading,
        posts: postsQuery.data ?? [],
        postAuthorFilter,
        postSortBy,
        postSortOrder,
        updatePostFilters,
        isPostsLoading: postsQuery.isLoading,
        refetchPosts,
        // User data (hoisted)
        users: usersQuery.data ?? [],
        fetchUsers,
        user,
        isAuthenticated,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}