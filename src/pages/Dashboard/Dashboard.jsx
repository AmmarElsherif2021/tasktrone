/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import '../../index.css'
import { PreviewProjects } from './PreviewProjects'
import { CreateProject } from '../../Components/Projects/CreateProject'
import { useAuth } from '../../contexts/AuthContext'
import { useUserHome } from '../../contexts/UserHomeContext'
import { useProject } from '../../contexts/ProjectContext'
import { createProject } from '../../API/projects'
import { getAllUsers } from '../../API/users'
import IconButton from '../../Ui/IconButton'
import StaticRoundBtn from '../../Ui/StaticRoundBtn'
import { ProfileImage } from '../../Components/User/ProfileImage'
import DashboardSkeleton from '../../Ui/LoadingSkeletons/DashboardSkeleton'
import { StyledCard } from '../../Ui/StyledCard'
import { MessengerRegister } from './MessangerRegister'
import { Modal } from '../../Ui/Modal'
import folderPlus from '../../assets/folderPlus.svg'
import userInfo from '../../assets/userInfo.svg'
import clock from '../../assets/clock.svg'
import boxes from '../../assets/boxes.svg'
import charts from '../../assets/charts.svg'
import alert from '../../assets/alert.svg'
import tools from '../../assets/tools.svg'
import gauge from '../../assets/gauge.svg'
import wrench from '../../assets/wrench.svg'
import trendUp from '../../assets/trend.svg'
import packageCheck from '../../assets/package.svg'
import clipboardCheck from '../../assets/clipboardCheck.svg'
import addNew from '../../assets/addNew.svg'

// -------------------- Tailwind Styles --------------------
const METRIC_CARD_BASE_CLASS =
  'w-32 h-32 border-2 border-neutral-black rounded-card font-mono font-bold text-center flex flex-col items-center justify-evenly p-2 text-black text-sm'

const CARD_HEADER_CLASS =
  'flex items-center justify-between py-3 border-b-2 border-sage font-mono font-bold text-black text-sm'

const ALERT_CLASS =
  'border-2 border-red-800 bg-transparent text-red-800 p-3 rounded'

const BUTTON_CLASS =
  'border-2 border-primary rounded-pill text-primary px-4 py-2 hover:bg-primary/10 transition-colors'

// -------------------- Tooltip --------------------
const Tooltip = ({ children, text }) => (
  <div className="relative inline-block group">
    {children}
    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-neutral-black rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none z-10">
      {text}
    </span>
  </div>
)

// -------------------- MetricCard --------------------
const MetricCard = ({ metric, value }) => (
  <div className={METRIC_CARD_BASE_CLASS} style={{ backgroundColor: metric.color }}>
    <img className="mb-2" style={{ width: '2rem' }} src={metric.icon} alt={metric.title} />
    <strong className="mb-1">{metric.title}</strong>
    <span>{value}{metric.unit && ` ${metric.unit}`}</span>
  </div>
)

// -------------------- CardHeader --------------------
const CardHeader = ({ icon, title, children }) => (
  <div className={CARD_HEADER_CLASS}>
    <div className="flex items-center gap-2">
      {icon && <img src={icon} alt={title} className="w-6 h-6" />}
      <h4 className="mb-0">{title}</h4>
    </div>
    {children}
  </div>
)

// -------------------- Constants --------------------
const METRICS_DATA = [
  { icon: clock,         title: 'In Progress',         key: 'tasksInProgress', color: '#87CEEB' },
  { icon: alert,         title: 'Critical Tasks',       key: 'criticalTasks',   color: '#FD5C5C' },
  { icon: clipboardCheck,title: 'Quality Issues',       key: 'qualityIssues',   color: '#F0E68C' },
  { icon: boxes,         title: 'Inventory Alerts',     key: 'inventoryAlerts', color: '#D2B48C' },
  { icon: tools,         title: 'Machine Downtime',     key: 'machineDowntime', color: '#FA8072', unit: 'hours' },
  { icon: gauge,         title: 'Cycle Time',           key: 'cycleTime',       color: '#90EE90', unit: 'avg hrs' },
  { icon: packageCheck,  title: 'On-Time Delivery',     key: 'onTimeDelivery',  color: '#B0C4DE', unit: '%' },
  { icon: wrench,        title: 'Pending Maintenance',  key: 'pendingMaintenance', color: '#B0E0E6', unit: 'tasks' },
  { icon: trendUp,       title: 'OEE',                  key: 'oee',             color: '#66CDAA', unit: '%' },
]

const QUICK_ACCESS_BUTTONS = [
  { title: 'Design Tasks',    color: '#E4080A' },
  { title: 'Manufacturing',   color: '#0F5A38' },
  { title: 'Quality Control', color: '#FF6201' },
  { title: 'Inventory',       color: '#1f3f4f' },
]

// -------------------- Dashboard --------------------
export function Dashboard() {
  const { isAuthenticated, user } = useAuth()
  const { userProjects, currentUser, isUserLoading, areProjectsLoading, refreshProjects } = useUserHome()
  const { setCurrentProjectId } = useProject()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [showCreateProject, setShowCreateProject] = useState(false)
  const [hoverStates, setHoverStates] = useState({ info: false, projects: false })

  // Mock metrics (would come from API in real app)
  const metrics = {
    tasksInProgress: 12, criticalTasks: 3, qualityIssues: 2, inventoryAlerts: 4,
    machineDowntime: 2.5, cycleTime: 4.2, onTimeDelivery: 87, pendingMaintenance: 6, oee: 92,
  }

  // ----- Hoisted user query (was in CreateProject) -----
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    staleTime: 30000,
  })

  // ----- Hoisted create-project mutation (was in CreateProject) -----
  const createProjectMutation = useMutation({
    mutationFn: (projectData) => createProject(projectData),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries(['projects'])
      queryClient.invalidateQueries(['project', newProject.id])
      setCurrentProjectId(newProject.id)
      setShowCreateProject(false)
      refreshProjects()
    },
    onError: (error) => console.error('Create project error:', error),
  })

  const handleCreateProject = (formData) => {
    // Prepare the payload expected by the API
    const payload = {
      title: formData.title,
      description: formData.description,
      start_date: formData.start_date,
      target_completion_date: formData.target_completion_date,
      wip_limit: formData.wip_limit,
      created_by: user.id,
      project_manager: user.id,
      members: formData.members.map((m) => ({
        user_id: m.user_id,
        role: m.role,
      })),
    }
    createProjectMutation.mutate(payload)
  }

  const handleProjectClick = (projectId) => {
    setCurrentProjectId(projectId)
    navigate(`/project/${projectId}/board`)
  }

  // ----- Loading state -----
  const isPageLoading = !isAuthenticated || isUserLoading || areProjectsLoading || isLoadingUsers

  if (isPageLoading) {
    return (
      <div className="opacity-80">
        <DashboardSkeleton />
      </div>
    )
  }

  // ----- Render helpers -----
  const renderProjectsHeader = () => (
    <div className="flex gap-2">
      <Tooltip text="View Analytics">
        <IconButton onClick={() => {}} color="#557263" src={charts} alt="Visualize data" />
      </Tooltip>
      <Tooltip text="Create New Project">
        <IconButton onClick={() => setShowCreateProject(true)} color="#186545" src={addNew} alt="Create new project" />
      </Tooltip>
    </div>
  )

  const renderEmptyProjects = () => (
    <div className="text-center py-6">
      <div className="flex flex-col items-center justify-center">
        <img src={folderPlus} alt="add project" className="w-8 h-8 mb-3" style={{ color: '#186545' }} />
        <p className="mb-3 text-gray-600">
          No manufacturing projects found. Create your first project to get started!
        </p>
        <button onClick={() => setShowCreateProject(true)} className={BUTTON_CLASS}>
          Create Project
        </button>
      </div>
    </div>
  )

  const renderUserInfo = () => {
    if (!currentUser) {
      return <div className={ALERT_CLASS}>User data not available</div>
    }
    return (
      <div className="flex flex-row">
        <ProfileImage user={currentUser} className="mr-4" size={4} />
        <div>
          <h5>{currentUser.full_name || 'No name provided'}</h5>
          <p className="text-gray-500 mb-1">{currentUser.email}</p>
          <p className="text-gray-500 mb-0">{currentUser.role || 'No role assigned'}</p>
          <p className="text-gray-500 mb-0">{currentUser.team || 'No team assigned'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid px-4 py-4">
      <h1 className="mb-4">
        Welcome back{currentUser?.full_name ? `, ${currentUser.full_name.split(' ')[0]}` : ''}
      </h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2 mb-4">
        {METRICS_DATA.map((metric) => (
          <MetricCard key={metric.title} metric={metric} value={metrics[metric.key] || 0} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="md:col-span-5 lg:col-span-4 space-y-4">
          <StyledCard hoverKey="info" hoverStates={hoverStates} handleHover={setHoverStates} className="p-4">
            <CardHeader icon={userInfo} title="Personal Information" />
            <div className="mt-3 text-sm">{renderUserInfo()}</div>
          </StyledCard>

          <StyledCard hoverKey="info" hoverStates={hoverStates} handleHover={setHoverStates} className="p-4">
            <CardHeader title="Quick Access" />
            <div className="mt-3">
              <div className="flex flex-wrap gap-2 text-xs">
                {QUICK_ACCESS_BUTTONS.map(({ title, color }) => (
                  <StaticRoundBtn key={title} src="" alt={title} handleClick={() => {}} color={color} />
                ))}
              </div>
            </div>
          </StyledCard>
        </div>

        {/* Right Column */}
        <div className="md:col-span-7 lg:col-span-8">
          <StyledCard hoverKey="projects" hoverStates={hoverStates} handleHover={setHoverStates}>
            <div className="p-4">
              <CardHeader icon={folderPlus} title="Projects">
                {renderProjectsHeader()}
              </CardHeader>
              {userProjects?.length ? (
                <PreviewProjects
                  projects={userProjects}
                  onProjectClick={handleProjectClick}
                />
              ) : (
                renderEmptyProjects()
              )}
            </div>
          </StyledCard>

          <MessengerRegister
            users={[
              { id: 'u1', name: 'Alice Chen',      role: 'design_engineer' },
              { id: 'u2', name: 'Bob Wilson',       role: 'cad_technician' },
              { id: 'u3', name: 'Carol Martinez',   role: 'production_supervisor' },
            ]}
            onClose={() => {}}
          />
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        title="Create New Project"
      >
        <CreateProject
          users={users}
          isLoadingUsers={isLoadingUsers}
          currentUserId={user.id}
          onSubmit={handleCreateProject}
          isCreating={createProjectMutation.isPending}
          onClose={() => setShowCreateProject(false)}
        />
      </Modal>
    </div>
  )
}