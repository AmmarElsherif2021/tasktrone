/**
 * ProjectContext.jsx
 * ─────────────────────────────────────────────────────────────
 * Three-layer data hierarchy (per platform requirements):
 *   Layer 1 — Organization   (Platform Owner scope)
 *   Layer 2 — Project        (Project Owner scope)
 *   Layer 3 — Product Line   (mapped to manufacturing_phase enum)
 *
 * The "Product Line" is the manufacturing phase lens applied to
 * a project's board. Selecting a phase filters the kanban to only
 * show tasks tagged to that manufacturing stage (task.phase).
 * The board columns are always the abstract task_status enum:
 *   todo → in_progress → review → done
 *
 * Supabase schema-aligned enums used here:
 *   manufacturing_phase: concept_design | prototyping |
 *     pre_production_planning | production | quality_control |
 *     assembly_testing | packaging_shipping | maintenance_support
 *   task_status:  todo | in_progress | review | done
 *   project_member_role_enum: coordinator | lead | contributor |
 *     reviewer | observer
 *   user_role: design_engineer | cad_technician | cnc_programmer |
 *     manufacturing_engineer | machinist | machine_operator |
 *     production_supervisor | qc_inspector | metrology_engineer |
 *     inventory_manager | production_planner | maintenance_technician |
 *     hr_personnel | logistics_coordinator
 * ─────────────────────────────────────────────────────────────
 * Backend split (as of the server/ hexagonal-foundation migration):
 *   - Tasks (tasksQuery below) come from the new NestJS backend via
 *     apiClient, GET /tasks?boardId=. currentProjectId is used AS the
 *     boardId — the new backend has no separate Project entity yet, so
 *     "project" and "board" are 1:1 for now. Only the fields the new
 *     Task model actually has are populated: id, boardId, title,
 *     description, status, position3d, modelRef, createdAt, updatedAt.
 *     Fields with no backend equivalent yet (taskType, taskCategory,
 *     manufacturingPhase, priority, leadTime, cycleTime, startDate,
 *     dueDate, members, requirements) are kept in the shape below so
 *     existing consumers don't crash, but are always empty/undefined
 *     until a later epic adds that data to the backend.
 *   - Project details/members, posts, and users still come from
 *     Supabase directly (client/src/API/*.js) — unchanged.
 * ─────────────────────────────────────────────────────────────
 */
import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjectById, updateProject } from '../API/projects'
import { getPosts } from '../API/posts'
import { useAuth } from '../contexts/AuthContext'
import { getAllUsers } from '../API/users'
import { get } from '../lib/apiClient'
import propTypes from 'prop-types'
// ─── Manufacturing phase display labels (Layer 3 / Product Line) ──
export const MANUFACTURING_PHASE_LABELS = {
  concept_design:          'Concept & Design',
  prototyping:             'Prototyping',
  pre_production_planning: 'Pre-Production Planning',
  production:              'Production',
  quality_control:         'Quality Control',
  assembly_testing:        'Assembly & Testing',
  packaging_shipping:      'Packaging & Shipping',
  maintenance_support:     'Maintenance & Support',
}

// ─── Task status → abstract phase label mapping ───────────────────
// Kanban columns align to the abstract workflow phases (B.2 in requirements)
export const TASK_STATUS_LABELS = {
  todo:        'Pending',     // "Work defined, awaiting prerequisites"
  in_progress: 'Active',      // "Resources allocated, execution begun"
  review:      'Inspection',  // "Output verification against standards"
  done:        'Completed',   // "Work complete, no further action"
}

// ─── Project member role labels (project_member_role_enum) ────────
export const PROJECT_ROLE_LABELS = {
  coordinator: 'Planner / Coordinator',
  lead:        'Team Lead',
  contributor: 'Execution Worker',
  reviewer:    'Quality Reviewer',
  observer:    'Observer',
}

// ─── Abstract role → user_role mapping for display ────────────────
export const ABSTRACT_ROLE_MAP = {
  design_engineer:       { abstract: 'Design Lead',          team: 'design_team' },
  cad_technician:        { abstract: 'Design Lead',          team: 'design_team' },
  cnc_programmer:        { abstract: 'Execution Worker',     team: 'manufacturing_team' },
  manufacturing_engineer:{ abstract: 'Execution Worker',     team: 'manufacturing_team' },
  machinist:             { abstract: 'Execution Worker',     team: 'manufacturing_team' },
  machine_operator:      { abstract: 'Execution Worker',     team: 'manufacturing_team' },
  production_supervisor: { abstract: 'Planner / Scheduler',  team: 'manufacturing_team' },
  qc_inspector:          { abstract: 'Quality Gatekeeper',   team: 'quality_control_team' },
  metrology_engineer:    { abstract: 'Quality Gatekeeper',   team: 'quality_control_team' },
  inventory_manager:     { abstract: 'Logistics / Handoff',  team: 'support_teams' },
  production_planner:    { abstract: 'Planner / Scheduler',  team: 'manufacturing_team' },
  maintenance_technician:{ abstract: 'Maintenance',          team: 'support_teams' },
  hr_personnel:          { abstract: 'Observer',             team: 'support_teams' },
  logistics_coordinator: { abstract: 'Logistics / Handoff',  team: 'support_teams' },
}

// ─────────────────────────────────────────────────────────────────
const ProjectContext = createContext()

export const useProject = () => useContext(ProjectContext)

export const ProjectProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // ── Layer 2: Project ──────────────────────────────────────────
  const [currentProjectId, setCurrentProjectId] = useState('')
  const [currentProject, setCurrentProject] = useState(null)
  const [currentProjectMembers, setCurrentProjectMembers] = useState([])

  // ── Layer 3: Product Line (manufacturing phase filter) ────────
  // null = show all phases (Platform Owner / unfiltered view)
  const [currentManufacturingPhase, setCurrentManufacturingPhase] = useState(null)

  // ── Derived metrics ───────────────────────────────────────────
  const [currentAvgLeadTime, setCurrentAvgLeadTime] = useState(0)
  const [currentAvgCycleTime, setCurrentAvgCycleTime] = useState(0)
  const [currentTasks, setCurrentTasks] = useState([])
  const [isTasksLoading, setIsTasksLoading] = useState(false)
  const [shouldFetchUsers, setShouldFetchUsers] = useState(false)

  // ── Blog / post filters ───────────────────────────────────────
  const [postAuthorFilter, setPostAuthorFilter] = useState('')
  const [postSortBy, setPostSortBy] = useState('created_at')
  const [postSortOrder, setPostSortOrder] = useState('desc')

  // ── Project query ─────────────────────────────────────────────
  const currentProjectQuery = useQuery({
    queryKey: ['project', currentProjectId],
    queryFn: () => getProjectById(currentProjectId),
    enabled: !!currentProjectId && isAuthenticated,
    select: (data) => ({
      ...data,
      members: data.project_members?.map((member) => ({
        user_id:   member.user.id,
        role:      member.role,
        username:  member.user.username,
        full_name: member.user.full_name,
        team:      member.user.team,
        user_role: member.user.role,                          // DB user_role enum
        abstract_role: ABSTRACT_ROLE_MAP[member.user.role]?.abstract ?? 'Observer',
        joined_at: member.joined_at,
      })) ?? [],
    }),
    staleTime: 30_000,
    retry: 2,
  })

  // ── Tasks query (new backend, via apiClient) ────────────────────
  // currentProjectId doubles as boardId until the backend gains a Project entity.
  const tasksQuery = useQuery({
    queryKey: ['tasks', currentProjectId],
    queryFn: () => {
      setIsTasksLoading(true)
      return get('/tasks', { boardId: currentProjectId })
    },
    select: (data) =>
      data.map((task) => ({
        _id:              task.id,
        project:          task.boardId,
        board:            task.boardId,
        title:            task.title,
        description:      task.description,
        author:           undefined,                          // no backend equivalent yet
        taskType:         undefined,                           // no backend equivalent yet
        taskCategory:     undefined,                            // no backend equivalent yet
        manufacturingPhase: undefined,                          // no backend equivalent yet
        status:           task.status,                          // task_status enum (kanban column)
        // Keep legacy `phase` alias pointing to kanban status for backward compat
        phase:            task.status,
        priority:         undefined,                            // no backend equivalent yet
        leadTime:         undefined,                            // no backend equivalent yet
        cycleTime:        undefined,                            // no backend equivalent yet
        startDate:        undefined,                            // no backend equivalent yet
        dueDate:          undefined,                            // no backend equivalent yet
        position3d:       task.position3d,
        modelRef:         task.modelRef,
        createdAt:        task.createdAt,
        updatedAt:        task.updatedAt,
        members:          [],                                   // no backend equivalent yet
        requirements:     [],                                   // no backend equivalent yet
      })),
    enabled: !!currentProjectId && isAuthenticated,
    staleTime: 30_000,
    retry: 2,
  })

  // ── Posts query ───────────────────────────────────────────────
  const postsQuery = useQuery({
    queryKey: ['posts', currentProjectId, { author: postAuthorFilter, sortBy: postSortBy, sortOrder: postSortOrder }],
    queryFn: () => getPosts(currentProjectId, { author: postAuthorFilter, sortBy: postSortBy, sortOrder: postSortOrder }),
    enabled: !!currentProjectId && isAuthenticated,
    staleTime: 60_000,
  })

  // ── Users query (lazy) ────────────────────────────────────────
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    enabled: shouldFetchUsers,
    staleTime: 5 * 60_000,
  })

  // ── Product Line: derive available phases from loaded tasks ───
  // This gives us the phase selector options without a separate API call.
  // Once a boards API is available: replace with getBoards(currentProjectId).
  const availableManufacturingPhases = useMemo(() => {
    if (!tasksQuery.data) return []
    const phaseSet = new Set(tasksQuery.data.map((t) => t.manufacturingPhase).filter(Boolean))
    return [...phaseSet].sort(
      (a, b) =>
        Object.keys(MANUFACTURING_PHASE_LABELS).indexOf(a) -
        Object.keys(MANUFACTURING_PHASE_LABELS).indexOf(b)
    )
  }, [tasksQuery.data])

  // ── Product Line filtered tasks (Layer 3 view) ────────────────
  // When a manufacturing phase is selected, filter tasks to that phase.
  // When null (Platform Owner "all phases" view), return all tasks.
  const productLineTasks = useMemo(() => {
    if (!currentTasks.length) return currentTasks
    if (!currentManufacturingPhase) return currentTasks
    return currentTasks.filter((t) => t.manufacturingPhase === currentManufacturingPhase)
  }, [currentTasks, currentManufacturingPhase])

  // ── Derived metrics ───────────────────────────────────────────
  useEffect(() => {
    if (tasksQuery.data) {
      const tasks = tasksQuery.data
      const totalCycle = tasks.reduce((acc, t) => acc + (t.cycleTime || 0), 0)
      const totalLead  = tasks.reduce((acc, t) => acc + (t.leadTime  || 0), 0)
      setCurrentAvgCycleTime(tasks.length ? totalCycle / tasks.length : 0)
      setCurrentAvgLeadTime (tasks.length ? totalLead  / tasks.length : 0)
    } else {
      setCurrentAvgCycleTime(0)
      setCurrentAvgLeadTime(0)
    }
  }, [tasksQuery.data])

  useEffect(() => {
    if (!tasksQuery.isLoading) setIsTasksLoading(false)
  }, [tasksQuery.isLoading])

  useEffect(() => {
    if (currentProjectQuery?.data) {
      setCurrentProject(currentProjectQuery.data)
      setCurrentProjectMembers(currentProjectQuery.data.members ?? [])
    }
  }, [currentProjectQuery.data]);

  // Project;s boards :
  const boards = useMemo(() => currentProject?.boards ?? [], [currentProject])
  //Tasks data
  useEffect(() => {
    if (tasksQuery.data) setCurrentTasks(tasksQuery.data)
  }, [tasksQuery.data, currentProjectId])

  useEffect(() => {
    if (!currentProjectId) {
      setCurrentProject(null)
      setCurrentProjectMembers([])
      setCurrentTasks([])
      setCurrentManufacturingPhase(null)
    }
  }, [currentProjectId])

  // ── Mutations ─────────────────────────────────────────────────
  const updateWipMutation = useMutation({
    mutationFn: ({ projectId, wip }) => updateProject(projectId, { wip_limit: wip }),
    onSuccess: () => queryClient.invalidateQueries(['project', currentProjectId]),
  })

  // ── Helpers ───────────────────────────────────────────────────
  const updatePostFilters = ({ author, sortBy, sortOrder }) => {
    if (author    !== undefined) setPostAuthorFilter(author)
    if (sortBy    !== undefined) setPostSortBy(sortBy)
    if (sortOrder !== undefined) setPostSortOrder(sortOrder)
  }

  const refetchPosts  = () => postsQuery.refetch()
  const refreshTasks  = () => tasksQuery.refetch()
  const refreshProject = () => currentProjectQuery.refetch()
  const fetchUsers    = () => setShouldFetchUsers(true)

  return (
    <ProjectContext.Provider
      value={{
        // ── Layer 2: Project ──
        currentProjectId,
        setCurrentProjectId,
        currentProject,
        currentProjectMembers,
        isProjectLoading: currentProjectQuery.isLoading,
        refreshProject,
        boards,

        // ── Layer 3: Product Line (manufacturing phase) ──
        currentManufacturingPhase,
        setCurrentManufacturingPhase,
        availableManufacturingPhases,
        productLineTasks,              // tasks filtered to current phase

        // ── Tasks (all, unfiltered) ──
        currentTasks,
        isTasksLoading,
        isTasksError: tasksQuery.isError,
        tasksError: tasksQuery.error,
        refreshTasks,

        // ── Derived metrics ──
        currentAvgLeadTime,
        setCurrentAvgLeadTime,
        currentAvgCycleTime,
        setCurrentAvgCycleTime,

        // ── WIP ──
        updateWipMutation,

        // ── Posts / Blog ──
        posts: postsQuery.data ?? [],
        postAuthorFilter,
        postSortBy,
        postSortOrder,
        updatePostFilters,
        isPostsLoading: postsQuery.isLoading,
        refetchPosts,

        // ── Users (hoisted, lazy) ──
        users: usersQuery.data ?? [],
        fetchUsers,

        // ── Auth ──
        user,
        isAuthenticated,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}
ProjectProvider.propTypes = {
  children: propTypes.node.isRequired,
}